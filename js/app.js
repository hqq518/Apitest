var myApp = angular.module('myApp', []);

myApp.controller('myCtrl', ['$scope', function($scope) {
	
	$scope.form = {
		method: "GET",		//发送方式:POST, GET
		url: null,			//URL
		contentType: "1", 	//发送编码方式：1 application/x-www-form-urlencoded， 2 application/json
		getParams: [],		//GET请求参数对象数组，如[{key:"userId",value:"test-value"}]
		headers: [],		//请求头对象数组，如[{key:"X-Test-Header",value:"test-value"}]
		jsonBody: null,		//Json请求体
		formBody: [],		//表单类型请求参数 
		result: null,		//请求结果
		requestHeaders: "",	//请求头信息
		responsHeaders: "",	//响应头信息
		
		init: function(){
			var _this = this;
			_this.getParams.push({
				key: null,
				value: null
			});
			_this.headers.push({
				key: null,
				value: null
			});
			_this.formBody.push({
				key: null,
				value: null
			});
		},
		
		/**
		 * 增加GET参数
		 */
		onAddGetParams: function(){
			var _this = this;
			_this.getParams.push({
				key: null,
				value: null
			});
		},
		/**
		 * 移除参数
		 * @param {Object} param 当前被移除的参数
		 */
		onRemoveGetParam: function(param){
			var _this = this;
			if(_this.getParams.length > 1){
				$.each(_this.getParams, function(i, n) {
					if(n == param){
						_this.getParams.splice(i, 1);
					}
				});
			}
		},
		
		/**
		 * 增加请求头
		 */
		onAddHeads: function(){
			var _this = this;
			_this.headers.push({
				key: null,
				value: null
			});
		},
		/**
		 * 移除请求头
		 * @param {Object} head 当前被移除的请求头
		 */
		onRemoveHead: function(head){
			var _this = this;
			if(_this.headers.length > 1){
				$.each(_this.headers, function(i, n) {
					if(n == head){
						_this.headers.splice(i, 1);
					}
				});
			}
		},
		
		/**
		 * 增加form参数
		 */
		onAddFormBody: function(){
			var _this = this;
			_this.formBody.push({
				key: null,
				value: null
			});
		},
		/**
		 * 移除参数
		 * @param {Object} param 当前被移除的参数
		 */
		onRemoveFormBody: function(param){
			var _this = this;
			if(_this.formBody.length > 1){
				$.each(_this.formBody, function(i, n) {
					if(n == param){
						_this.formBody.splice(i, 1);
					}
				});
			}
		},
		/**
		 * 合并参数到URL上
		 */
		combieUrlParams: function(){
			var _this = this;
			if(_this.getParams.length > 1){
				var paramStr = "";
				$.each(_this.getParams, function() {
					if(this.key && this.value){
						paramStr += "&" + this.key + "=" + this.value;
					}
				});
				if(paramStr != ""){
					paramStr = paramStr.replace("&", "?");
					//console.log("_paramStr", paramStr);
					return paramStr;
				}
			}
			return "";
		},
		/**
		 * 组装POST参数
		 */
		combieFormBodyParams: function(){
			var _this = this;
			if(_this.formBody.length > 1){
				var paramStr = "";
				$.each(_this.formBody, function() {
					if(this.key && this.value){
						paramStr += "&" + this.key + "=" + this.value;
					}
				});
				if(paramStr != ""){
					paramStr = paramStr.replace("&", "");
					return paramStr;
				}
			}
			return "";
		},
		/**
		 * 使用Ajax发送数据
		 * @param {Object} contentType
		 */
		onSend: function(){
			var _this = this;
			
			$scope.isError = false;
			_this.result = null;
			_this.responsHeaders = "";
			
			//提取参数
			var urlParams = _this.combieUrlParams();
			var postParams = _this.combieFormBodyParams();
			
			//console.log("表单数据", _this);
			$.ajax({
				type: _this.method,
				url: _this.method == "GET" ? (_this.url + urlParams) : _this.url,
				async: true,
				cache: false,
				contentType: _this.contentType == "1" ? "application/x-www-form-urlencoded" : "application/json",
				data: _this.contentType == "1" ? postParams : JSON.stringify(_this.jsonBody),
				beforeSend: function(xhr){
					if(_this.headers.length > 0){
						// 设置请求头信息
						$.each(_this.headers, function() {
							if(this.key && this.value){
								xhr.setRequestHeader(this.key, this.value);
							}
						});
					}
				},
				complete: function(xhr, ts){
					//console.log("xhr", xhr);
					// 获取响应头
					_this.responsHeaders = xhr.getAllResponseHeaders();
					$scope.$apply();
				},
				success: function(result){
					//console.log(result);
					_this.result = result;
					$scope.$apply();
				},
				error: function(request, error, exception){
					console.error("request",request);
					console.error("error",error);
					console.error("exception",exception);
					_this.result = request;
					$scope.isError = true;
					$scope.$apply();
				}
			});
			
			// 将本次API信息存入本地存储
			var saveObj = $.extend(true, {}, _this);
			saveObj.result = null;
			saveObj.responsHeaders = "";
			$scope.storage.save(JSON.stringify(saveObj));
			// 重新加载历史请求列表
			$scope.storage.initList();
			// 将第一个设置为选中状态
			$scope.storage.setSelected(0);	
		},
		/**
		 * 重置
		 */
		onReset: function(){
			var _this = this;
			_this.method = "GET";		//发送方式:POST, GET
			_this.url = null;			//URL
			_this.contentType = "1"; 	//发送编码方式：1 application/x-www-form-urlencoded， 2 application/json
			_this.getParams = [];		//GET请求参数对象数组，如[{key:"userId",value:"test-value"}]
			_this.headers = [];			//请求头对象数组，如[{key:"X-Test-Header",value:"test-value"}]
			_this.jsonBody = null;		//Json请求体
			_this.formBody = [];		//表单类型请求参数 
			_this.result = null;		//请求结果
			_this.requestHeaders = "";	//请求头信息
			_this.responsHeaders = "";	//响应头信息
			_this.init();
			$scope.isError = false;
		}
	}
	
	/**
	 * 本地存储
	 * @param {Object} obj
	 */
	$scope.storage = {
		urlList: [],			//历史请求列表
		curSelected: null,		//当前选中的历史记录
		delType: 1,				//删除类型，1删除选中，2删除所有
		
		/**
		 * 获取所有数据
		 */
		initList: function(){
			var _this = this;
			var dataArr = [];
			if(window.localStorage){
	            for(var i = 0; i < localStorage.length; i++){
	            	var key = localStorage.key(i);
	            	var data = localStorage.getItem(key);
	            	if(data){
	            		var formObj = JSON.parse(data);
	            		dataArr.push({
	            			time: key,
	            			method: formObj ? formObj.method : "",
	            			url : formObj ? formObj.url : "",
	            			selected: false
	            		});
	            	}
	            }
	        }
			//按时间倒序排序
			if(dataArr.length > 0){
				dataArr.sort(function(item0, item1){
					return parseInt(item1.time) - parseInt(item0.time);
				});
			}
			_this.urlList = dataArr;
		},
		
		/**
		 * 保存字符串到localStorage中
		 * @param {Object} obj
		 */
		save: function(obj){
			if(window.localStorage){
	            if(obj && typeof(obj) === 'string'){
	            	var key = new Date().getTime() + "";
	            	localStorage.setItem(key, obj);
	            }
	        } 
		},
		/**
		 * 获取指定key的数据
		 * @param {Object} key
		 */
		item: function(key){
			var obj = null;
			if(window.localStorage && key){
	            obj = JSON.parse(localStorage.getItem(key));
	        } 
	        return obj;
		},
		/**
		 * 从本地存储中删除指定的key
		 * @param {Object} key
		 */
		delete: function(key){
			if(window.localStorage && key){
	            localStorage.removeItem(key);
	        } 
		},
		/**
		 * 从本地存储中删除所有记录
		 */
		clear: function(){
			if(window.localStorage){
	            localStorage.clear();
	        }
		},
		/**
		 * 确定删除
		 */
		onDelOk: function(){
			var _this = this;
			if(_this.delType == 1 && _this.curSelected){	//删除选中记录
				var key = _this.curSelected.time;
				_this.delete(key);
			}else if(_this.delType == 2){					//清空所有记录
				_this.clear();
			}
			$("#delDialog").modal('hide');					// 关闭询问框
			_this.initList();								// 重新加载历史请求列表
		},
		/**
		 * 设置选中的记录
		 * @param {Object} index 第几个被选中,下标从0开始
		 */
		setSelected: function(index){
			var _this = this;
			if(index >= 0){
				var setObj = _this.urlList[index];
				_this.onSelect(setObj);
			}
		},
		/**
		 * 当选中时
		 * @param {Object} item
		 */
		onSelect: function(item){
			var _this = this;
			$.each(_this.urlList, function() {
				if(this == item){
					this.selected = true;
					_this.curSelected = item;
				}else {
					this.selected = false;
				}
			});
			
			//获取当前选中的详情数据
			var obj = _this.item(item.time);
			if(obj){
				var form = $scope.form;
				form.onReset();
				form.method = obj.method;	
				form.url = obj.url;			
				form.contentType = obj.contentType; 	
				form.getParams = obj.getParams;		
				form.headers = obj.headers;			
				form.jsonBody = obj.jsonBody;		
				form.formBody = obj.formBody;		
			}
		}
	}
	
	$scope.form.init();				// 初始化表单对象
	$scope.storage.initList();		// 初始化历史请求列表
}]);