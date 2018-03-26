function bg_zoom(){
	
	var page_bg = $(".pages.active").find(".page_bg");
	var page_bg_img = page_bg.find("img");
	
	if(page_bg_img.hasClass("transform") == false)
		page_bg_img.addClass("transform");
	
	page_bg_img.removeClass('transform');
	setTimeout(
		function(){page_bg_img.addClass('transform')}
	, 1);
}

function resize_page(){
	
	if($(".pages.active").length == 0)
		$(".pages").css("min-height", window.innerHeight+"px");
	else
		$(".pages.active").css("min-height", window.innerHeight+"px");
	
	$(".page_bg").css("min-height", window.innerHeight+"px");
	
	//-ueber_mich
	$("#page_ueber_mich_text").css("margin-top", window.innerHeight*0.4+"px");
	$("#page_ueber_mich_gallerie_button").css("top", window.innerHeight*0.8+"px");
	
	//-gallerie
	$("#page_gallerie_content").css("margin-top", window.innerHeight*0.8+"px");
	$(".page_gallerie_slideshow_elements").css("height", $(".page_gallerie_slideshow_elements").width()*0.7+"px")
	for(var x=0; x<$(".page_gallerie_slideshow_elements").length; x++)
		coverimg($(".page_gallerie_slideshow_elements").eq(x));
	
	if($("#page_gallerie_preview.active").length)
		gallerie_preview_resize( $("#page_gallerie_preview").find("#page_gallerie_preview_img").find("img") );
}

function close_page(page){
	
	$(".page_bg").find("img").stop();
	
	if(page == "page_home"){
		var task1 = $.Deferred();
		
		$("#page_home .nav_bg").stop().animate({"height":"0px"}, 600, function(){
			task1.resolve();
		});
		$("#page_home_bottom_img").stop().animate({"width":"0px", "height":"100%"}, 600);
		$("#page_home_bottom").stop().fadeOut(500);
		
		return $.when(task1).done().promise();
	}
	
	if(page == "page_ueber_mich"){
		var task1 = $.Deferred();
		
		$("#page_ueber_mich .nav_bg").stop().animate({"height":"0px"}, 600);
		$("#page_ueber_mich_bg_transparent").stop().animate({"width":"0px"}, 600, function(){
			task1.resolve();
		});
		$(".page_ueber_mich_content_kontakt").stop().fadeOut(600, function(){
			$(".page_ueber_mich_content_kontakt").show().css("visibility", "hidden");
		});
		$(".page_ueber_mich_content").stop().fadeOut(600, function(){
			$(".page_ueber_mich_content").show().css("visibility", "hidden");
		});
		
		return $.when(task1).done().promise();
	}
	if(page == "page_gallerie"){
		var task1 = $.Deferred();
		
		$("#page_gallerie_slideshow_wrapper").stop().animate({"opacity":"0"}, 600);
		$("#page_gallerie_text").fadeOut(300);
		$("#page_gallerie_slideshow_bg").fadeOut(600);
		$("#page_gallerie_preview").hide();
		
		$("#page_ueber_mich .nav_bg").stop().animate({"height": "0px"}, 1000, function(){
			task1.resolve();
		});
		
		return $.when(task1).done().promise();
	}
	if(page == undefined){
		var task1 = $.Deferred();
		task1.resolve();
		return $.when(task1).done().promise();
	}
}
var scroll_only = 0;
var page_scroll_bottom = false;
function open_page(page){
	
	var url = window.location+"";
	var cur_page = $(".pages.active").attr("id");
	
	if(page == ""){
		if(url.split("#")[1] != undefined){
			page = url.split("#")[1];
		}
		else{
			page = "home";
		}
		$(".pages#"+page).addClass("active");
		cur_page = undefined;
	}
	if(scroll_only == 1){
		cur_page = undefined;
		scroll_only = 0;
	}
	
	close_page(cur_page).done(function(){
		
		window.location.replace(url.split("#")[0]+"#"+page);
		
		if($("#page_"+page).length){
			
			//-background
			if($(".pages.active").length == 0){
				$(".page_bg").css({"position":"fixed", "z-index":"-1"});
				$("#page_"+page).find(".page_bg").css({"position":"absolute", "z-index":"0"});
			}
			else{				
				if($(".pages.active").index() < $("#page_"+page).index()){
					$(".page_bg").css({"position":"fixed", "z-index":"-1"});
					$(".pages.active").next(".pages").find(".page_bg").css({"position":"absolute", "z-index":"0"});
				}
				else{
					$(".page_bg").css({"position":"fixed", "z-index":"-1"});
					$(".pages.active").find(".page_bg").css({"position":"absolute", "z-index":"0"});
				}
			}
			
			//first scroll
			var scroll_pages = 0;
			var scroll_next_page = page;
			var scroll_pos = 0;
			
			if($(".pages.active").length)
				scroll_pages = $(".pages.active").index()-$("#page_"+page).index();
			
			if(scroll_pages > 0){
				scroll_next_page = $(".pages").eq($(".pages.active").index()-1).attr("id").replace("page_", "");
				$("html, body").animate({scrollTop:$(".pages.active").offset().top+"px"},0);
			}
			if(scroll_pages < 0){
				scroll_next_page = $(".pages").eq($(".pages.active").index()+1).attr("id").replace("page_", "");
				$("html, body").animate({scrollTop:$(".pages.active").offset().top+$(".pages.active").height()-window.innerHeight+"px"},0);
			}
			
			if(page_scroll_bottom == true){
				page_scroll_bottom = false;
				scroll_pos = $("#page_"+scroll_next_page).offset().top+$("#page_"+scroll_next_page).height()-window.innerHeight;
			}
			else{
				scroll_pos = $("#page_"+scroll_next_page).offset().top;
			}
			
			//background
			$(".page_bg").hide();
			$(".page_bg").eq($(".pages.active").index()).show();
			$(".page_bg").eq($("#page_"+scroll_next_page).index()).show();
			
			$(".pages").removeClass("active");
			$("#page_"+scroll_next_page).addClass("active");
			bg_zoom();
			$(".pages").removeClass("active");
			
			$("html, body").stop().animate({scrollTop:scroll_pos+"px"}, 600, function(){
				
				$("#page_"+scroll_next_page).addClass("active");
				
				//background
				$(".pages.active").find(".page_bg").css({"position":"fixed", "z-index":"0"});
				
				resize_page();
				
				if(scroll_pages > 1 || scroll_pages < -1){
					scroll_only = 1;
					open_page(page);
				}
				else{
					scroll_running = 0;
					enable_scroll();
					
					$(".nav_open").hide();
					$(".nav_closed").show();
					$("#nav_"+page).find(".nav_open").show();
					$("#nav_"+page).find(".nav_closed").hide();
					
					switch(scroll_next_page){
						case "home":
							
							$("#page_home .nav_bg").stop().animate({"height": "300px"}, 500);
							$("#page_home_bottom_img").stop().animate({"height":"500px", "width":"1400px"}, 500, function(){
								$("#page_home_bottom").stop().fadeIn(500);
							});
						break;
						
						case "ueber_mich":
							
							$("#page_ueber_mich_bg_transparent").stop().animate({"width":"100%"}, 600, function(){
								$(".page_ueber_mich_content").css("visibility", "visible").hide().stop().fadeIn(600);
							});
							$("#page_ueber_mich .nav_bg").stop().animate({"height": "300px"}, 1000);
							
						break;
						
						case "gallerie":
							$("#page_gallerie_slideshow_bg").fadeIn(1000);
							$("#page_gallerie_text").fadeIn(1000);
							$("#page_gallerie_slideshow_wrapper").stop().animate({"opacity":"1"}, 1000, function(){
								$("#page_ueber_mich .nav_bg").stop().animate({"height": "300px"}, 1000);
								$("#page_gallerie_preview").show();
							});
						break;
					}
					
				}				
			});
		}
		else{
			open_page("home");
		}
	});
}

var lastScrollTop = 0;
var scroll_running = 0;
var timeout = null;

//gallerie
function gallerie_preview_resize( img ){
	//resize img
	var relation = img.width() / img.height();
	
	var new_height = window.innerHeight*0.9;
	var new_width = new_height*relation;
	
	if(new_width > $("#page_gallerie_preview_img").width()*0.9){
		new_width = $("#page_gallerie_preview_img").width()*0.9;
		new_height = new_width/relation;
	}
	$("#page_gallerie_preview_img").find("img").css({"margin-top":(window.innerHeight-new_height)/2+"px", "margin-left":($("#page_gallerie_preview_img").width()-new_width)/2+"px", "width":new_width+"px", "height":new_height+"px"});
	
	$("#page_gallerie_preview_descr table").css("margin-top", (window.innerHeight-new_height)/2+"px");
}
function gallerie_preview( element ){
	
	//open preview
	$("#nav, .nav_bg").stop().animate({"opacity":"0"}, 500);
	$("#page_gallerie_slideshow_wrapper").css({"opacity": "0"});
	$("#page_gallerie_preview").css({"z-index":"3"}).stop().animate({"opacity": "1"}, 700, function(){
		$("#page_gallerie_preview").addClass("active");
	});
	$("#page_gallerie_preview_img").find("img").css("opacity", "0");
		
	$("#page_gallerie_preview_img").find("img").attr({"src":element.attr("src")+"#"+Date.now(), "alt":element.attr("alt")}).load(function(){
		
		$("#page_gallerie_preview_img").find("img").animate({"opacity":"1"}, 500);
		
		gallerie_preview_resize( element );
		
	});
}
function gallerie_preview_close(){
	
	$("#nav, .nav_bg").stop().animate({"opacity":"1"}, 500);
	$("#page_gallerie_preview").css({"z-index":"1","opacity":"0"}).removeClass("active");
	$("#page_gallerie_slideshow_wrapper").stop().animate({"opacity": "1"}, 300);
}

// footer
function footer_close(){
	$("#footer_content").stop().fadeOut(300, function(){
		$("#footer_bg").stop().animate({"height":"0px"}, 500);
		$("#footer").removeClass("active");
	});
}
function footer_open(){
	$("#footer_bg").stop().animate({"height":"350px"}, 500, function(){
		$("#footer_content").stop().fadeIn(500);
		$("#footer").addClass("active");
	});
}

$(document).ready(function(){
	
	for(var x=0; x<$(".page_bg").length; x++)
		coverimg($(".page_bg").eq(x));
	
	$(window).load(function(){
		
		resize_page();
			
		open_page("");
		
		$(window).on("resize", function(){
			resize_page();
			
			$(".page_bg").find("img").removeClass("transform");
			for(var x=0; x<$(".page_bg").length; x++)
				coverimg($(".page_bg").eq(x));
			bg_zoom();
			
			if($(".pages.active").length){
				
				if($(window).scrollTop()>$(".pages.active").offset().top+$(".pages.active").height()-window.innerHeight)
					$("html, body").animate({scrollTop:$(".pages.active").offset().top+$(".pages.active").height()-window.innerHeight+"px"});
				
				if($(window).scrollTop()<$(".pages.active").offset().top)
					$("html, body").animate({scrollTop:$(".pages.active").offset().top+"px"});
			}
		});
		
		
		$(window).scroll(function(event){
			
				if(scroll_running)
					return;
				
				var st = $(this).scrollTop();
				if (st > lastScrollTop){
					
					//downscroll
					
					if($(".pages.active").length 
						&& $(".pages.active").offset().top+$(".pages.active").height() < $(window).scrollTop()+window.innerHeight 
						&& $(".pages.active").next(".pages").length){
							
						$("html, body").scrollTop($(".pages.active").offset().top+$(".pages.active").height()-window.innerHeight);
						disable_scroll();
						scroll_running = true;
						
						var new_page = $(".pages.active").next(".pages").attr("id").replace("page_","");
						if(new_page.length)
							open_page(new_page);
					}
				}
				else{
					// upscroll
					
					if($(".pages.active").length 
						&& $(".pages.active").offset().top > $(window).scrollTop()
						&& $(".pages.active").prev(".pages").length){
							
						$("html, body").scrollTop($(".pages.active").offset().top);
						disable_scroll();
						scroll_running = true;
						page_scroll_bottom = true;
						
						var new_page = $(".pages.active").prev(".pages").attr("id").replace("page_","");
						if(new_page.length)
							open_page(new_page);
					}
				}
				lastScrollTop = st;
			
			if($("#page_gallerie_preview.active").length)
				gallerie_preview_close();
			
			if($(".pages.active").length){
				if($(window).scrollTop() == $("body").height()-window.innerHeight){
					if($("#footer.active").length == 0){
						footer_open();
					}
				}
				else{
					if($("#footer.active").length){
						footer_close();
					}
				}
			}
		});	
	});
	
	$("#nav").find("li").click(function(){
		open_page($(this).attr("data-page"));
	});
	$("#nav").find("li").hover(function(){
		if("page_"+$(this).attr("data-page") != $(".pages.active").attr("id")){
			$(this).find(".nav_closed").hide();
			$(this).find(".nav_open").stop().fadeIn(300);
		}
	}, function(){
		if("page_"+$(this).attr("data-page") != $(".pages.active").attr("id")){
			$(this).find(".nav_open").hide();
			$(this).find(".nav_closed").stop().fadeIn(300);
		}
	});
	$(".angle_button").hover(function(){
		$(this).stop().animate({"background-color":"rgba(255,255,255,0.6);"}, 300);
	},
	function(){
		$(this).stop().animate({"background-color":"rgba(0,0,0,0.6)"}, 300);
	});
	
	
	//-home
	$("#page_home_scroll").click(function(){
		open_page("ueber_mich");
	});
	
	//-ueber_mich
	$("#page_ueber_mich_kontakt_button").click(function(){
		$(".page_ueber_mich_content").hide();
		$(".page_ueber_mich_content_kontakt").stop().fadeIn(1000);
	});
	$("#page_ueber_mich_kontakt_button_back").click(function(){
		$(".page_ueber_mich_content_kontakt").hide();
		$(".page_ueber_mich_content").stop().fadeIn(1000);
	});
	
	$("#page_ueber_mich_kontakt_form").find("input, textarea").on("input", function(){
		
		var check_form = true;
		
		$("#page_ueber_mich_kontakt_form").find("input:required, textarea:required").each(function(){
			if($(this).val() == "")
				check_form = false;
		});
		
		if(check_form == false){
			if($("#page_ueber_mich_kontakt_form_submit").hasClass("active"))
				$("#page_ueber_mich_kontakt_form_submit").removeClass("active");
		}
		else{
			$("#page_ueber_mich_kontakt_form_submit").addClass("active");
		}
	});
	
	$("#page_ueber_mich_kontakt_form form").submit(function() {
		
		if($("#page_ueber_mich_kontakt_form_submit").hasClass("active")){
			
			$(".page_ueber_mich_kontakt_form_buttons").hide();
			$("#page_ueber_mich_kontakt_form_submit_sending").stop().fadeIn(1000);
			
			$.post($("#cms_home_dir").text()+"temp/kontakt_form.php", {
					name 		: $("#page_ueber_mich_kontakt_form input[name='name']").val(),
					email 		: $("#page_ueber_mich_kontakt_form input[name='email']").val(),
					telefon 	: $("#page_ueber_mich_kontakt_form input[name='telefon']").val(),
					nachricht 	: $("#page_ueber_mich_kontakt_form input[name='nachricht']").val()
				})
				.done(function(data) {
					$("#page_ueber_mich_kontakt_form_input").hide(600, function(){
						$("#page_ueber_mich_kontakt_form").find("input, textarea").each(function(){
							$(this).val("");
						});
					});
					$(".page_ueber_mich_kontakt_form_buttons").hide();
					$("#page_ueber_mich_kontakt_form_submit_success").fadeIn(1000);
				});
		}
		else{
			alert("*Bitte alle markierten Felder ausfüllen.");
		}
	});
	
	
	//-gallerie
	$("#page_gallerie_slideshow").find("img").wrap("<div class='page_gallerie_slideshow_elements'></div>");
	$(".page_gallerie_slideshow_elements:last").after("<div class='clear'></div>");
	resize_page();
	
	
	$(".page_gallerie_slideshow_elements").hover(function(){
		
		if($(this).hasClass("active") == false){
			$(this).append($(".page_gallerie_slideshow_elements_details").clone(true));
			$(this).find(".page_gallerie_slideshow_elements_details").stop().fadeIn(400);
			$(this).find("img").addClass("hover");
		}
	},
	function(){
		
		if($(this).hasClass("active") == false){
			$(".page_gallerie_slideshow_elements").find(".page_gallerie_slideshow_elements_details").remove();
			$(this).find("img").removeClass("hover");
		}
	});	
	
	$(".page_gallerie_slideshow_elements_details").click(function(){
		gallerie_preview( $(this).closest(".page_gallerie_slideshow_elements").find("img") );
	});
});

