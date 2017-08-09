;(function(){
	var task_list = [];	//任务列表
var $add_task = $(".container .add-task"); //提交


//1.创建一个对像  push数组里面
//2.把数据存到浏览器
//3.把数据取出来
//
init();//初始化，将保存的任务展示出来
$add_task.on("submit",function (ev) {
	ev.preventDefault(); //阻止默认事件
	// console.log(1);
	var obj = {};
	obj.content = $add_task.find("input").eq(0).val();
	if (!obj.content) {return;};//输入为空则返回
	addTask(obj);
	createHtml();
	$add_task.find("input").eq(0).val(null); //清空数组，防止为输入数据也会按原来的数据创建
});


function addTask(obj) {
	console.log(task_list);
	task_list.push(obj);
	store.set("event",task_list);
}

function init() {
	task_list = store.get("event") || [];
	createHtml();
}

//创建html
function createHtml() {
	var $task = $(".container .task-list");
	$task.html(null);
	//判断是否标记
	for(var i = 0;i < task_list.length;i++) {
		if(task_list[i].complated) {
			var tem = task_list.splice(i,1)[0];
			task_list.unshift(tem);//放到列表后面（数组前面）
		}
	}
	for(var i = 0;i < task_list.length;i++) {
		var $item = bindHtml(task_list[i],i);
		$task.prepend($item);
		//要给所有的加类
		if(task_list[i].complated) {
			$(".container .task-item").addClass("flag");
			console.log(i);
		}
	}
	//鼠标经过特效
	// mouseOn();
	deleteItem();
	getIndex();// 获取删除内容index
	eventComplated(); //完成事件
}

//鼠标讲过特效
// function mouseOn() {
// 	$(".container form input").eq(1).hover(function () {
// 		$(this).css("background","#46b8e4");
// 	});
// 	$(".container .task-item").hover(function ()  {
// 		$(this).css("background","#46b8e4");
// 	})
// }
	

//绑定html
function bindHtml(ele,i) {
	var str = "";
	str = 	'<div class="task-item" data-index="'+i+'">'+
				'<input type="checkbox" '+(ele.complated? 'checked': "")+'>'+
				'<span class="task-title">'+ele.content+'</span>'+
				'<span class="delete">删除</span>'+
				'<span class="detail">详情</span>'+
			'</div>'
	return $(str);
}

//删除
function deleteItem() {
	//删除键绑定事件
	$(".task-list .task-item .delete").each(function (index,ele) {
		$(ele).on("click",function () {
			var dataIndex = $(this).parent().data("index");
			var pop = "";
			pop = '<div style="position: fixed; top: 0px; bottom: 0px; left: 0px; right: 0px; background: rgba(0, 0, 0, 0.498039);"></div><div style="color: rgb(68, 68, 68); width: 300px; height: auto; padding: 15px 10px; position: fixed; border-radius: 3px; box-shadow: rgba(0, 0, 0, 0.498039) 0px 1px 2px; left: 522.5px; top: 92px; background: rgb(255, 255, 255);">'+
			'<div class="pop-title" style="padding: 5px 10px; font-weight: 900; font-size: 20px; text-align: center;">确定删除?</div><div class="pop-content" style="padding: 5px 10px; text-align: center;"><div><button style="margin-right: 5px; background: #46b1e4; display: inline-block;cursor: pointer;color: #333;" class="primary confirm">确定</button><button class="cancel">取消</button></div></div></div>';
			$(".container").after(pop);
			//删除后的弹框绑定事件
			$(".confirm").on("click",function () {
				$(".container").siblings().remove();
				task_list.splice(dataIndex,1);
				store.set("event",task_list);
				createHtml();
			});
			$(".cancel").on("click",function () {
				$(".container").siblings().remove();
			});
		});
	});
}

//详细目录
//1.点击获取index

function getIndex() {
	$(".task-list .detail").click(function () {
		var index = $(this).parent().data("index");
		add_task_detail(task_list[index]);
		fixContent();
		up_detail(index);
		console.log(index);
	});
}
//2.生成弹框
function add_task_detail(data) {
	var str = "";
	str = '<div class="task-detail-mask" style="display: block;"></div>'+
		'<div class="task-detail" style="display: block;">'+
			'<form>'+
				'<div class="content">'+'<span>'+data.content+'</span>'+'<span class="esc" style="float: right;">×</span></div>'+
				'<div class="contentTitle">'+
					'<input style="display: none;" type="text" name="content" value="'+data.content+'">'+
				'</div>'+
				'<div>'+
					'<div class="desc input-item">'+
						'<textarea name="desc">'+(data.detailContent || "")+'</textarea>'+
					'</div>'+
				'</div>'+
			'<div class="remind input-item">'+
			'<label>提醒时间</label><input class="datetime" name="remind_date" type="date" value="'+(data.time || "")+'"></div>'+
			'<div class="input-item"><button type="submit">更新</button></div></form></div>';
	$(".container .task-list").after(str);
	removeDetail();
	
}
//3.删除弹框
function removeDetail() {
	$(".container .task-detail-mask,.esc").click(function () {
		$(".container .task-detail-mask,.task-detail").remove();
	});
}

//点击更新
function up_detail(index) {
	$(".task-detail .input-item").find("button").click(function (ev) {
		ev.preventDefault();
		var newobj = {};
		newobj.content = $(".task-detail form .content span").eq(0).text();
		newobj.detailContent = $(".input-item").find("textarea").val();
		newobj.time = $(".input-item .datetime").val();
		console.log(newobj);
		fixdetail(index,newobj);
		$(".container .task-detail-mask,.task-detail").remove();
		createHtml();
	});
}

//双击改变conten
function fixContent() {
	var $inpContent = $(".task-detail form .contentTitle input");
	console.log($(".task-detail form .contentTitle input"));
	$(".task-detail form .content").dblclick(function () {
		$inpContent.show();
		$inpContent.focus();
		console.log($inpContent);
		//改事件要写早里面
		$inpContent.blur(function () {
			if(!$inpContent.val()) {
				$inpContent.hide();
				return;
			} 
			$(".task-detail form .content span").eq(0).text($inpContent.val());
			$inpContent.hide();
			console.log(task_list);
		});
	});
}

function fixdetail(index,newobj) {
	//task_list[index] = newobj;
	task_list[index] = $.extend({},task_list[index],newobj); //这种方式合并对象不同名不会覆盖
	store.set("event",task_list);
	// add_task_detail(newobj);
	
}

//完成事件
function eventComplated() {
	$(".task-list .task-item input").click(function () {
		var index = $(this).parent().data("index");
		console.log(task_list);
		if(task_list[index].complated) {
			fixdetail(index,{complated:false});
		}
		else {
			fixdetail(index,{complated:true});
		}
		createHtml();
	});
}

}()); 