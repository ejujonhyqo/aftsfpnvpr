const jsonUrl = './src/json/vaxsites.json';
const badgeWrapper = '#badge-wrapper';
const noResult = '#no-result';
const bodyHere = '.list';
const allData = [];
const jsonData = [];

$.ajax({
	url: jsonUrl,
	beforeSend: function() {
		$(badgeWrapper).hide();
		$(noResult).hide();
		$(bodyHere).text('読み込み中です');
	}
})
.then(
	function(data) {
		$(badgeWrapper).show();
		allData = data;
		jsonData = allData.vaxsite;
		display();
		loadListjs();
	},
	function() {
		$(bodyHere).text('読み込みに失敗しました');
	}
);

// JSONの内容を表示
function display() {
	$(bodyHere).empty();
	const html = '';
	for (const i = 0; i < jsonData.length; i++) {
		const vaxSiteThird = jsonData[i].third;
		const vaxSiteBookingString = jsonData[i].booking;
		const vaxSitePharma = jsonData[i].pharma;
		
		const vaxSiteStatus = jsonData[i].status;
		const vaxSiteWeb = jsonData[i].web;
		const vaxSiteName = jsonData[i].name;
		const vaxSiteAddress = jsonData[i].address;
		const vaxSiteMap = jsonData[i].map;
		const vaxSiteAge = jsonData[i].age;
		if (window.innerWidth < 480) {
			const vaxSiteAgeMobile = vaxSiteAge.replace(/以上/g, '+');
		}	
		const vaxSiteGeneral = jsonData[i].general;
		const vaxSiteNote = jsonData[i].note;
		const vaxSiteBooking = vaxSiteBookingString.replace(/LINE/g, '<a href="https://list.botlogy.com/" target="_blank">LINE</a>').replace(/ライン/g, 'LINE');
		
		html +=
		'<div class="frame" data-accept="' + jsonData[i].accept +
		'" data-ward="' + jsonData[i].ward +
		'" data-pharma="' + vaxSitePharma + '">' +
			'<div class="basic">' +
				'<div class="status ';
				if (vaxSiteStatus.match(/^(受付|◇|○|△)$/)) {
					html += 'status-green">' + vaxSiteStatus + '</div>';
				} else if (vaxSiteStatus.match(/^(準備中|検討中|満員|休止)$/)) {
					html += 'status-orange">' + vaxSiteStatus + '</div>';
				} else if (vaxSiteStatus.match(/^(終了|未実施)$/)) {
					html += 'status-red">' + vaxSiteStatus + '</div>';
				} else {
					html += 'status-others">不明</div>';
				}
				if (vaxSiteWeb !== '') {
					html += '<h3><a href="' + vaxSiteWeb + '" target="_blank" rel="noopener noreferrer"><span class="name">' + vaxSiteName + '</span></a></h3>';
				} else {
					html += '<h3 class="name">' + vaxSiteName + '</h3>';
				}
				html +=
				'<div class="address-wrapper">' +
					'<span class="address">' + vaxSiteAddress + '</span> ';
					if (window.innerWidth < 480) {
						if (vaxSiteMap === '') {
							html += '<a href="https://www.google.co.jp/maps?q=' + vaxSiteName + '+' + vaxSiteAddress + '" target="_blank">(地図)</a>';
						} else {
							html += '<a href="' + vaxSiteMap + '" target="_blank">(地図)</a>';
						}
					} else {
						if (vaxSiteMap === '') {
							html += '<a href="https://www.google.co.jp/maps?q=' + vaxSiteName + '+' + vaxSiteAddress + '" target="_blank">(地図を見る)</a>';
						} else {
							html += '<a href="' + vaxSiteMap + '" target="_blank">(地図を見る)</a>';
						}
					}
				html +=
				'</div>' +
			'</div>' +
			'<div class="vaxsite-info">';
				if (vaxSitePharma === 'pfe') {
					html +='<div class="pharma"><span class="pharma-icon pfe"></span>ファイザー</div>';
				} else if (vaxSitePharma === 'pfemrna') {
					html +=
					'<div class="pharma pharma2">' +
						'<div><span class="pharma-icon pfe"></span>ファイザー</div>' +
						'<div><span class="pharma-icon mrna"></span>モデルナ</div>' +
					'</div>';
				} else if (vaxSitePharma === 'mrna') {
					html += '<div class="pharma"><span class="pharma-icon mrna"></span>モデルナ</div>';
				} else if (vaxSitePharma === 'az') {
					html +='<div class="pharma"><span class="pharma-icon az"></span>AZ</div>';
				}
				html +=
				'<div class="third-wrapper">3回目:<span class="third">' + vaxSiteThird + '</span></div>' +
				'<div class="age">';
				if (window.innerWidth < 480) {
					if (vaxSiteAge === 'NA') {
						html += '不明';
					} else {
						html += vaxSiteAgeMobile;
					}
				} else {
					if (vaxSiteAge === 'NA') {
						html += '年齢不明';
					} else {
						html += vaxSiteAge;
					}
				}
				html +=
				'</div>';
				if (vaxSiteGeneral === '一般不可') {
					html += '<div class="color-red">' + vaxSiteGeneral + '</div>';
				} else {
					html += '<div>' + vaxSiteGeneral + '</div>';
				}
			html +=
			'</div>';
			if (vaxSiteNote !== '') {
				html += '<p class="p">備考: ' + vaxSiteNote + '</p>';
			}
			if (vaxSiteBooking !== '') {
				html += '<p class="p">予約方法: <span class="booking">' + vaxSiteBooking + '</span></p>';
			}
			if (jsonData[i].vnavi !== null) {
				html += '<p class="p">→ <a href="https://v-sys.mhlw.go.jp/search/list.html?id=261009&keyword=' + vaxSiteName + '&vaccineMaker=&page=1" target="_blank">コロナワクチンナビで検索</a></p>';
			}
		html +=
		'</div>';
	}
	$(bodyHere).html(html);
}

// List.js Plugin
function loadListjs() {
	const options = {
		valueNames: [{ data: ["accept"] }, "third", "booking", { data: ["ward"] }, { data: ["pharma"] }, "name", "address"],
		searchDelay: 350,
		searchColumns: ["name", "address"],
		page: 50,
		pagination: {
			innerWindow: 3,
			outerWindow: 1
		}
	};
	
	const listObj = new List("main", options);
	
	// Copyright (c) 2016 by Whitney Gainer (https://codepen.io/wmg481/pen/RRRKdm)
	// Released under the MIT license
	// https://opensource.org/licenses/mit-license.php
	
	// 絞り込む
	$('#form-wrapper input, #form-wrapper select').change(function() {
		const acceptValue = $('input[name=accept]:checked').val();
		const thirdValue = $('input[name=third]:checked').val();
		const bookingValue = $('input[name=booking]:checked').val();
		const wardValue = $('input[name=ward]:checked')
			.map(function() {
				return $(this).val();
			})
			.get();
		const pharmaValue = $('#filter-type').val();

		listObj.filter(function(item) {
			const boolean_accept = false;
			const boolean_third = false;
			const boolean_booking = false;
			const boolean_ward = false;
			const boolean_pharma = false;

			if (acceptValue == null) {
				boolean_accept = true;
			} else {
				boolean_accept = item.values().accept.includes(acceptValue);
			}
			if (thirdValue == null) {
				boolean_third = true;
			} else {
				boolean_third = item.values().third.includes(thirdValue);
			}
			if (bookingValue == null) {
				boolean_booking = true;
			} else {
				boolean_booking = item.values().booking.includes(bookingValue);
			}
			if (wardValue.length == 0) {
				boolean_ward = true;
			} else {
				boolean_ward = wardValue.find(function (element) {
					return element === item.values().ward;
				});
			}
			if (pharmaValue === 'all') {
				boolean_pharma = true;
			} else if (pharmaValue) {
				boolean_pharma = item.values().pharma.includes(pharmaValue);
			}
			return boolean_accept && boolean_third && boolean_booking && boolean_ward && boolean_pharma;
		});
	});
	
	// 件数が1件以上の場合、件数を表示して「結果がありません」を隠す
	listObj.on('updated', function (list) {
		if (list.matchingItems.length > 0) {
			$(badgeWrapper).show();
			$(noResult).hide();
		} else {
			$(badgeWrapper).hide();
			$(noResult).show();
		}
	});
	
	// Copyright (c) 2018 by Matthew Elsom (https://codepen.io/matthewelsom/pen/RYrqmb)
	// Released under the MIT license
	// https://opensource.org/licenses/mit-license.php
	
	// 件数を表示する
	const itemNumber = ('#item-number');
	$(itemNumber).text(listObj.size());
	listObj.on('updated', function(){
		$(itemNumber).text(listObj.matchingItems.length);
	});
}

// Copyright (c) 2019 by AgoPeanuts (https://codepen.io/AgoPeanuts/pen/zbpRzJ)
// Released under the MIT license
// https://opensource.org/licenses/mit-license.php

// チェックボックスを全て選択または解除する
$(function() {
	const selectAll = $('#select-all');
	const wardInput = $('#filter-ward input');
	$(selectAll).on('click', function() {
		$(wardInput).prop('checked', this.checked);
	});
	$(wardInput).on('click', function() {
		if ($('#filter-ward :checked').length == $(wardInput).length) {
			$(selectAll).prop('checked', true);
		} else {
			$(selectAll).prop('checked', false);
		}
	});
});
