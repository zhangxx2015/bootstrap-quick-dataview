/**
*
* @author      zhangxx<20437023@qq.com>
* @version     1.0
* @since       1.0
* Date         2020-05-28
* Time         18:00:00
*/
$(function(){if("undefined"==typeof(zfx)){zfx={};
	$(`<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
					<h4 class="modal-title" id="myModalLabel"></h4>
				</div>
				<div class="modal-body">
					<div class="row">
						<div class="col-md-4">
							<div id="myModalAlert" class="alert alert-danger" style="display:none;"></div>
						</div>
					</div>
					<form>
					</form>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-primary" >保存</button>
					<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
				</div>
			</div>
		</div>
	</div>`).appendTo(document.body);
	$(`.table`).each(function(_,table){with($(table)){
		$.ajax({url: attr('ajaxUrl'),data: attr('ajaxData'),type: attr('ajaxMethod'),dataType: "json",success: function(datas) {let trs=[];
			datas.forEach(function(a,b,c){let tds=[];
				$(table).find("thead > tr > th").each(function(_,d){
					let name=$(d).attr("name")||'';
					let title=$(d).html();
					let value=a[name]||'';
					let renderer=$(d).attr("renderer");
					if(renderer&&renderer.length>0)if("undefined"!==eval(`typeof(${renderer})`)){tds.push(`<td>${eval(`${renderer}(${zfx.across(a)})`)}</td>`);return;}
					if(name&&name.length>0)tds.push(`<td>${'index'===name?1+b:value}</td>`);
				});
				trs.push(`<tr>${tds.join("")}</tr>`);
			});
			$(table).find('tbody').html(trs.join(""));
		}});
	}});
	if(!zfx.across)zfx.across=function(obj){
		return `JSON.parse(unescape('${escape(JSON.stringify(obj))}'))`;
	};
	if(!zfx.showDialog)zfx.showDialog=function(title,table,row,cb){
		$('#myModalLabel').html(title);
		$('#myModalAlert').html('').hide();
		let items=[];
		let cols={};
		$(`#${table}`).find("thead > tr > th").each(function(_,d){
			let name=$(d).attr("name")||'';
			let title=$(d).html();
			let type=$(d).attr("type")||'string';
			if(name.length<1)return;
			cols[name]={"title":title,"type":type};
			if(name!="index")items.push(`
			<div class="form-group">
				<label for="${name}">${title}</label>
				${{"string":`<input type="text" class="form-control" id="${name}" placeholder="${title}" />`,
				"boolean":`<input type="checkbox" id="${name}"> `,
				"int":`<input type="number" class="form-control" id="${name}" placeholder="${title}" />`,
				}[$(d).attr('type')||'string']}
			</div>`)
		});
		$('#myModal > div > div > div.modal-body > form').html(items.join("\n"));
		if(row)Object.getOwnPropertyNames(row).forEach(function(name){
			$(`#${name}`).val(row[name])
			if(cols.hasOwnProperty(name))({
					"string":function(){$(`#${name}`).val(row[name]);},
					"boolean":function(){$(`#${name}`).prop('checked',row[name]);},
					"int":function(){$(`#${name}`).val(row[name]);},
				})[cols[name].type]();
		});
		$('#myModal').modal('show');
		$('#myModal > div > div > div.modal-footer > button.btn.btn-primary').unbind('click').click(function(){
			$('#myModalAlert').html('').hide();
			let data={};
			Object.getOwnPropertyNames(cols).forEach(function(name){
				data[name]=$(`#${name}`).val();
			});
			if(row)Object.getOwnPropertyNames(row).forEach(function(name){
				data[name]=row[name];
				if($(`#${name}`).val())data[name]=$(`#${name}`).val();
			});
			if(cb){
				let result=cb(data);
				if("undefined"===typeof(result)){
					$('#myModal').modal('hide');
					return;
				}
				$('#myModalAlert').html(result).show();
			}
		});
	};
}});