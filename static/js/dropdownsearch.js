// let names = [];
// for (let i = 0; i < data.length; i++)
//     names.push(data[i]['IATA_Code'])
// $('#searchbutton').on('click', function() {
//     google.maps.event.trigger(marker[index], 'click');
// })


//Initialize with the list of symbols
// $('.dropdown-menu').hide();
// $('#menuItems').hide();
// let names = [];
// for (let i = 0; i < data.length; i++)
//     names.push(data[i]['IATA_Code'])

// //Find the input search box
// let search = document.getElementById("searchbar")

// //Find every item inside the dropdown
// let items = document.getElementsByClassName("dropdown-item-list-group-item list-group-item-action")

// function buildDropDown(values) {
//     let contents = []
//     for (let name of values) {
//         contents.push('<a href="#" class="list-group-item list-group-item-action" value="' + name + '"/>')
//     }
//     $('#menuItems').append(contents.join(""))

//     //Hide the row that shows no items were found
//     $('#empty').hide()
// }

// //Capture the event when user types into the search box
// window.addEventListener('input', function() {
//     // $('.dropdown-menu').show();

//     if ($('searchbar').val() != "") {
//         $('#menuItems').show();
//         filter(search.value.trim().toLowerCase())
//     }
// })

// //For every word entered by the user, check if the symbol starts with that word
// If it does show the symbol, else hide it
// function filter(word) {
//     let length = items.length
//     let collection = []
//     let hidden = 0
//     for (let i = 0; i < length; i++) {
//         if (items[i].value.toLowerCase().startsWith(word)) {
//             $(items[i]).show()
//         } else {
//             $(items[i]).hide()
//             hidden++
//         }
//     }

//     //If all items are hidden, show the empty view
//     if (hidden === length) {
//         $('#empty').show()
//     } else {
//         $('#empty').hide()
//     }
// }


//If the user clicks on any item, set the title of the button as the text of the item
// $('#menuItems').on('click', '.dropdown-item', function() {
//     $('#dropdown_coins').text($(this)[0].value)
//     $("#dropdown_coins").dropdown('toggle');
// })

// buildDropDown(names)