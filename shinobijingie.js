/**
 *------
 * BGA framework: © Gregory Isabelli <gisabelli@boardgamearena.com> & Emmanuel Colin <ecolin@boardgamearena.com>
 * shinobijingie implementation : © <Erin Bernardoni> <erin.bernardoni@outlook.fr>
 *
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 *
 * shinobijingie.js
 *
 * shinobijingie user interface script
 * 
 * In this file, you are describing the logic of your user interface, in Javascript language.
 *
 */

define([
    "dojo","dojo/_base/declare",
    "ebg/core/gamegui",
    "ebg/counter",
    "ebg/stock"
],
function (dojo, declare) {
    return declare("bgagame.shinobijingie", ebg.core.gamegui, {
        constructor: function(){
            console.log('shinobijingie constructor');
              
            // Here, you can init the global variables of your user interface
            // Example:
            // this.myGlobalValue = 0;

            this.cardwidth = 88;
            this.cardheight = 142;

            this.clanValues = {
                "Toad": { 1: 0, 3: 1, 4: 2 },
                "Spider": { 3: 3, 4: 4 },
                "Raven": { 2: 5, 3: 6, 4: 7 },
                "Carp": { 1: 8, 2: 9, 3: 10, 4: 11, 5: 12 },
                "Dragon": { 3: 13, 4: 14, 5: 15 },
                "Rat": { 3: 16, 4: 17, 5: 18 },
                "Monkey": { 1: 19, 2: 20, 3: 21 },
                "Fox": { 2: 22, 3: 23, 4: 24, 5: 25 },
                "Bear" : {6 : 26},
                "Ronin" : { 1 : 36}
            };

            this.yokaiValues = {
                "y_Dragon" : 27,
                "y_Yurei" : 28,
                "y_Kitsune" : 29,
                "y_Kappa" : 30,
                "y_Saitenza" : 31,
                "y_TheMonkeyKing" : 32,
                "y_TheOldHermit" : 33,
                "y_Mezumi" : 34,
                "y_Oni" : 35
            };

            this.descs = {
                "Toad": "Return 1 card to its owner's hand",
                "Spider": "Destroy 1 card",
                "Raven": "Look through the Jigoku and choose 2 cards to add to your hand",
                "Carp": "Draw 2 cards from the Shinobi deck",
                "Dragon": "Look at the 1st 3 cards of the Shinobi deck, keep 1, and destroy the others",
                "Rat": "An opponent must discard 2 cards of his choice",
                "Monkey": "Copy the [2 cards] power of an enemy clan",
                "Fox": "Exchange 3 cards from your hand for 3 cards from an opponent's hand, chosen by him",
                "Bear" : "-",
                "Ronin" : "The Ronin is considered to be a card of the clan with which it is placed",
                "y_Dragon" : "Consultez les 5 premières cartes de la pile Shinobi, gardez-en 2 et défaussez les autres",
                "y_Yurei" : "Destroy 1 clan",
                "y_Kitsune" : "Echangez la totalité de votre main contre celle d'un adversaire",
                "y_Kappa" : "Return 1 clan to its owner's hand",
                "y_Saitenza" : "Détruisez tous les Yokai du jeu",
                "y_TheMonkeyKing" : "Copier le pouvoir [3 cartes] d’un clan adverse",
                "y_TheOldHermit" : "Draw 4 cards from the Shinobi deck",
                "y_Mezumi" : "An opponent must discard 3 cards of his choice",
                "y_Oni" : "“Boo!”"
            }

        },
        
        /*
            setup:
            
            This method must set up the game user interface according to current game situation specified
            in parameters.
            
            The method is called each time the game interface is displayed to a player, ie:
            _ when the game starts
            _ when a player refreshes the game page (F5)
            
            "gamedatas" argument contains all datas retrieved by your "getAllDatas" PHP method.
        */
        
        setup: function( gamedatas )
        {
            console.log( "Starting game setup" );

            this.played_cards_players = {};

            
            // Setting up player boards
            for( var player_id in gamedatas.players )
            {
                var player = gamedatas.players[player_id];
                         
                // TODO: Setting up players boards if needed

                // PLAYED CARDS OF EACH PLAYER
                // get played cards of this player from gamedata
                played_cards = [];
                for (card_id in this.gamedatas.cards_played_by_player) {
                    let card = this.gamedatas.cards_played_by_player[card_id];
                    if(card['location_arg'] == player.id) played_cards.push(card);
                }

                div_id = this.player_id == player.id ? 'myplacedcards' : 'playerplacedcards_' + player.id;

                this.played_cards_players[player.id] = new ebg.stock();
                this.createStock(this.played_cards_players[player.id], $(div_id), played_cards);
                this.played_cards_players[player.id].setSelectionMode(0);
            }
            
            // TODO: Set up your game interface here, according to "gamedatas"
            // create all cards types & add it as items of the stock "playerHand"

            dojo.addClass("player_corrupted", "ninja_" + this.gamedatas.players[ this.player_id ].color);

            // PLAYER HAND
            this.playerHand = new ebg.stock();
            this.createStock(this.playerHand, $('myhand'), this.gamedatas.hand);
            this.playerHand.setSelectionMode(0);
            

            // DISCARD PILE
            this.discardPile = new ebg.stock();
            this.createStock(this.discardPile, $('discard'), this.gamedatas.discard);
            this.discardPile.container_div.width = this.cardwidth; // enought just for 1 card
            this.discardPile.autowidth = false; // this is required so it obeys the width set above
            this.discardPile.use_vertical_overlap_as_offset = false; // this is to use normal vertical_overlap
            this.discardPile.vertical_overlap = 100; // overlap
            this.discardPile.horizontal_overlap  = -1; // current bug in stock - this is needed to enable z-index on overlapping items
            this.discardPile.item_margin = 0; // has to be 0 if using overlap
            this.discardPile.updateDisplay(); // re-layout
            this.discardPile.setSelectionMode(0);


            // get last card put in discard and display it
            // var discard_keys = Object.keys(this.gamedatas.discard);
            // console.log("keys" + discard_keys);
            // if (discard_keys.length > 0) {
            //     var card = this.gamedatas.discard[discard_keys[0]];
            //     console.log("card" + card);
            //     var type = card.type;
            //     var value = card.type_arg; 
            //     this.discardPile.addToStockWithId(this.getCardId(type, value), card.id);
            // }

            dojo.connect(this.discardPile, 'onChangeSelection', this, 'onPlayerDiscardChangeSelection');
            dojo.connect(this.playerHand, 'onChangeSelection', this, 'onPlayerHandChangeSelection')


            // Modify number of cards in deck
            this.updateDeckCardsNb(this.gamedatas.cards_nb.deck);
            // Modify number of cards in discard
            this.updateDiscardCardsNb(this.gamedatas.cards_nb.discard);
            // Modify number of cards in corrupt areas
            this.updateCorruptCardsNb(this.gamedatas.corrupt_cards);

 
            // Setup game notifications to handle (see "setupNotifications" method below)
            this.setupNotifications();

            console.log( "Ending game setup" );
        },
       

        ///////////////////////////////////////////////////
        //// Game & client states
        
        // onEnteringState: this method is called each time we are entering into a new game state.
        //                  You can use this method to perform some user interface changes at this moment.
        //
        onEnteringState: function( stateName, args )
        {
            console.log( 'Entering state: '+stateName );
            
            switch( stateName )
            {

                case 'selectCardsToPlace':
                    if (this.isCurrentPlayerActive()) {
                        this.playerHand.setSelectionMode(2);
                        this.getSelectableCards(this.playerHand.getSelectedItems());
                    }
                    break;
          
           
            case 'dummmy':
                break;
            }
        },

        // onLeavingState: this method is called each time we are leaving a game state.
        //                 You can use this method to perform some user interface changes at this moment.
        //
        onLeavingState: function( stateName )
        {
            console.log( 'Leaving state: '+stateName );
            
            switch( stateName )
            {
            
                case 'selectCardsToPlace':
                    this.playerHand.setSelectionMode(0);
                    break;
           
           
            case 'dummmy':
                break;
            }               
        }, 

        // onUpdateActionButtons: in this method you can manage "action buttons" that are displayed in the
        //                        action status bar (ie: the HTML links in the status bar).
        //        
        onUpdateActionButtons: function( stateName, args )
        {
            console.log( 'onUpdateActionButtons: '+stateName );
                      
            if( this.isCurrentPlayerActive() )
            {            
                switch( stateName )
                {
                    case 'drawPhase':
                        this.addActionButton('recruit_button', _('Draw one card'), 'onRecruitBtn');
                        this.addActionButton('beCorrupt_button', _('Be Corrupt'), 'onBeCorruptBtn');
                        break;

                    case 'selectCardsToPlace':
                        this.addActionButton('placeClan_button', _("Place clan"), 'onPlaceClanBtn');
                        this.addActionButton('reinforceClan_button', _("Reinforce clan"), 'onReinforceClanBtn');
                        this.addActionButton('pass_button', _("Pass"), 'onPassBtn', null, false, 'red');
                        break;
/*               
                 Example:
 
                 case 'myGameState':
                    
                    // Add 3 action buttons in the action status bar:
                    
                    this.addActionButton( 'button_1_id', _('Button 1 label'), 'onMyMethodToCall1' ); 
                    this.addActionButton( 'button_2_id', _('Button 2 label'), 'onMyMethodToCall2' ); 
                    this.addActionButton( 'button_3_id', _('Button 3 label'), 'onMyMethodToCall3' ); 
                    break;
*/
                }
            }
        },        

        ///////////////////////////////////////////////////
        //// Utility methods
        
        /*
        
            Here, you can defines some utility methods that you can use everywhere in your javascript
            script.
        
        */

        getClans: function() {
            return (
                {
                    "Rat": [3, 3, 3, 4, 4, 4, 5, 5, 5],
                    "Fox": [2, 3, 3, 3, 4, 4, 4, 4, 5],
                    "Toad": [1, 1, 3, 3, 3, 4, 4, 4, 4],
                    "Spider": [3, 3, 3, 3, 4, 4, 4, 4, 4],
                    "Raven": [2, 2, 2, 3, 3, 3, 4, 4, 4],
                    "Carp": [1, 1, 2, 2, 3, 3, 4, 4, 5],
                    "Dragon": [3, 3, 3, 4, 4, 4, 4, 5, 5],
                    "Monkey": [1, 1, 1, 1, 2, 2, 2, 2, 3],
                    "Bear": [6, 6, 6, 6, 6, 6, 6, 6, 6],
                    "Ronin" : [1],
                    "y_Dragon": [5],
                    "y_Yurei": [1],
                    "y_Kitsune": [3],
                    "y_Kappa": [3],
                    "y_Saitenza": [3],
                    "y_TheMonkeyKing": [1],
                    "y_TheOldHermit": [3],
                    "y_Mezumi": [3],
                    "y_Oni": [8],
                }
            );
        },

        createStock: function(stock, div, cards) {
            stock.create(this, div, this.cardwidth, this.cardheight);
            stock.onItemCreate = dojo.hitch(this, 'setupNewCard');

            stock.image_items_per_row = 9;
            let clans = this.getClans();

            // add all possible cards in stock
            for (let clan in clans) {
                clans[clan].forEach(cardValue => {
                    var card_id = this.getCardId(clan, cardValue);
                    stock.addItemType(card_id, card_id, g_gamethemeurl + 'img/shinobi_cards.jpg', card_id);
                });
            }

            for (let i in cards) {
                var card = cards[i];
                var type = card.type;
                var value = card.type_arg;
                stock.addToStockWithId(this.getCardId(type, value), card.id);
            }
        },

        setupNewCard: function(card_div, card_type_id, card_id) {
            // card_type_id => card id in sprite
            this.addTooltip(card_div.id, _(this.descs[this.getCardClanName(card_type_id)]), '' );
        },

        getCardId: function(card, value) {
            if (card.split("_").length === 1) {
                return this.clanValues[card][value];
            } else {
                return this.yokaiValues[card];
            }
        },

        getCardClanName: function(cardId) {
            for (var clanName in this.clanValues) {
                for (var value in this.clanValues[clanName]) {
                    if (this.clanValues[clanName][value] === cardId) {
                        return(clanName);
                    }
                }
            }
        
            for (var yokaiName in this.yokaiValues) {
                if (this.yokaiValues[yokaiName] === cardId) {
                    return(yokaiName);
                }
            }
        
            return null;
        },

        getCardIdFromRealId: function(id) {

        },

        updateDeckCardsNb: function (new_value) {
            var deck_cards = document.getElementById("deck-cards-nb");
            deck_cards.textContent = new_value;
        },

        updateDiscardCardsNb: function (new_value) {
            var discard_cards = document.getElementById("discard-cards-nb");
            discard_cards.textContent = new_value;
        },

        updateCorruptCardsNb: function (new_value) {
            for( var player_id in this.gamedatas.players )
            {
                var player = this.gamedatas.players[player_id];
                var div = dojo.query('.ninja_' + player.color).query(".my_hand_ninja");

                if (new_value[player.id]) {
                    div[0].innerText = new_value[player.id];
                } else {
                    div[0].innerText = 0;
                }

            }
        },

        showDiscardPile: function() {
            this.myDlg = new ebg.popindialog();
            this.myDlg.create('discardPileDialog');
            this.myDlg.setTitle(_("Jigoku"));

            var html = this.format_block('jstpl_discardDialog', {

            });

            // show the dialog
            this.myDlg.setContent(html);

            this.discardDialog = new ebg.stock();
            this.createStock(this.discardDialog, $('discard-dialog'), this.gamedatas.discard);

            this.myDlg.show();

            dojo.connect($('dialog-ok-button'), 'onclick', this, (event) => {
                event.preventDefault();
                this.myDlg.destroy();
            });
        },


        onPlayerDiscardChangeSelection: function() {
            var items = this.discardPile.getSelectedItems();

            if (items.length > 0) {
                this.showDiscardPile();
                this.discardPile.unselectAll();
            }
        },

        
        isClan: function(name) {
            return (name.split("_").length === 1);
        },

        getSelectedClan: function(selectedCards) {
            if (Object.keys(selectedCards).length > 0) {

                var roninType = this.clanValues["Ronin"][1];

                // if only one card : return card (will be yokai, clan or ronin)
                if (Object.keys(selectedCards).length === 1) {
                    return this.getCardClanName(selectedCards[0].type);
                } else {
                    // multiple cards : must find only clan (exclude ronins)
                    for (var key in selectedCards) {
                        if (selectedCards.hasOwnProperty(key)) {
                            var type = selectedCards[key].type;
                            // get selected clan
                            if (type !== roninType) return this.getCardClanName(type);
                        }
                    }
                }
            }

            return null;
        },

        getSelectableCards: function(selectedCards) {
            // Name of clan/yokai/ronin or null if none is selected 
            var selectedClan = this.getSelectedClan(selectedCards);

            // Get all unselected cards to then make sorting
            var unselectedCards = this.playerHand.getUnselectedItems();

            for (card in unselectedCards) {
                var type = unselectedCards[card]['type'];
                var id = unselectedCards[card]['id'];

                if (selectedClan) {
                    if (selectedClan.split("_").length === 1) {
                        // // there is a clan or ronin selected
                        if (selectedClan === "Ronin" && 
                            (this.getCardClanName(type) === "Ronin" || 
                            this.isClan(this.getCardClanName(type)))) {

                            // case only one ronin : can select any other CLAN or Ronin card
                            dojo.addClass(this.playerHand.getItemDivId(id), 'selectable');

                            
                        } else if (this.getCardClanName(type) === selectedClan || 
                                    this.getCardClanName(type) === "Ronin" ){

                            // case real clan selected : can select other cards of same clan or ronin
                            dojo.addClass(this.playerHand.getItemDivId(id), 'selectable');

                        } else {
                            // card should not be selectable : remove selectable class
                            dojo.removeClass(this.playerHand.getItemDivId(id), 'selectable');
                        }
                    } else {

                        // there is a yokai selected : cannot select other card
                        dojo.removeClass(this.playerHand.getItemDivId(id), 'selectable');

                    }
                } else {
                    // no card is selected : all cards become selectable
                    dojo.addClass(this.playerHand.getItemDivId(id), 'selectable');

                }
            }
            

            // if already one clan : can select all cards

            // if no clan : cannot select yokai

            // max 4 cards of same clan or ronin
        },


        onPlayerHandChangeSelection: function(control_name, item_id) {
            // check if card is selectable, else remove selection


            var selectedCardDiv = this.playerHand.getItemDivId(item_id);

            if (!(selectedCardDiv.split("_")[2] === "undefined")) {
                if (dojo.hasClass(selectedCardDiv, 'selectable')) {
                    dojo.removeClass(selectedCardDiv, 'selectable');
                } else {
                    this.playerHand.unselectItem(item_id);
                }
            }



            this.getSelectableCards(this.playerHand.getSelectedItems());
        },

        ///////////////////////////////////////////////////
        //// Player's action
        
        /*
        
            Here, you are defining methods to handle player's action (ex: results of mouse click on 
            game objects).
            
            Most of the time, these methods:
            _ check the action is possible at this game state.
            _ make a call to the game server
        
        */

        onRecruitBtn: function(evt) {
            console.log("Draw card");
            
            // Preventing default browser reaction
            dojo.stopEvent( evt );

            if ( this.checkAction('recruit') ) // check that this action is possible at this moment
            {
                this.ajaxcall("/shinobijingie/shinobijingie/recruit.html", {
                }, this, function(result) {});
            }
        },

        onBeCorruptBtn: function(evt) {
            console.log("Be corrupt");

            // Preventing default browser reaction
            dojo.stopEvent( evt );

            if ( this.checkAction('beCorrupt') ) // check that this action is possible at this moment
            {
                this.ajaxcall("/shinobijingie/shinobijingie/beCorrupt.html", {
                }, this, function(result) {});
            }
        },

        areSelectedCardsOnlyRonin: function(selected_cards) {
            for (card in selected_cards) {
                if (this.getCardClanName(selected_cards[card]["type"]) !== "Ronin") return false;
            }

            return true;
        },

        onPlaceClanBtn: function(evt) {
            console.log("Place clan");

            // Preventing default browser reaction
            dojo.stopEvent( evt );

            
            if ( this.checkAction('placeClan') ) // check that this action is possible at this moment
            {
                switch (this.playerHand.getSelectedItems().length) {
                    case 0:
                        // no card selected
                        this.showMessage(_('You first need to select card(s)!'), 'error');
                        return;
                    
                    case 1:
                        // only one card selected
                        this.showMessage(_('You need to select 2, 3 or 4 cards to place a clan!'), 'error');
                        return;
                
                    default:
                        // check if more than 4 cards
                        if (this.playerHand.getSelectedItems().length > 4) {
                            this.showMessage(_('You need to between 2 and 4 cards to place a clan!'), 'error');
                            return;
                        }

                        // check if only ronins are selected
                        if (this.areSelectedCardsOnlyRonin(this.playerHand.getSelectedItems())) {
                            this.showMessage(_('You need to select at least one clan card!'), 'error');
                            return;
                        }

                        // check if this clan is not in place

                        // get this ids of the selected cards
                        var selectedCards = this.playerHand.getSelectedItems().map(item => parseInt(item.id));

                        // pass in the ids of the selected cards (ids are the same here and in db)
                        this.ajaxcall("/shinobijingie/shinobijingie/placeClan.html", {
                            playedCards: selectedCards.join(',')   
                        }, this, function(result) {
                            this.playerHand.unselectAll();
                        });
                        break;
                }
                // if (this.playerHand.getSelectedItems().length > 0) {
                //     if ()
                // } else {
                //     this.showMessage(_('You first need to select card(s)!'), 'error');
                //     return;
                // }
                // this.ajaxcall("/shinobijingie/shinobijingie/placeClan.html", {
                // }, this, function(result) {});
            }
        },

        onReinforceClanBtn: function(evt) {
            console.log("Reinforce clan");

            // Preventing default browser reaction
            dojo.stopEvent( evt );

            if ( this.checkAction('reinforceClan') ) // check that this action is possible at this moment
            {
                this.ajaxcall("/shinobijingie/shinobijingie/reinforceClan.html", {
                }, this, function(result) {});
            }
        },

        onPassBtn: function(evt) {
            console.log("Pass");
            dojo.stopEvent( evt );

            if ( this.checkAction('pass') ) // check that this action is possible at this moment
            {
                this.ajaxcall("/shinobijingie/shinobijingie/pass.html", {
                }, this, function(result) {});
            }
        },
        
        /* Example:
        
        onMyMethodToCall1: function( evt )
        {
            console.log( 'onMyMethodToCall1' );
            
            // Preventing default browser reaction
            dojo.stopEvent( evt );

            // Check that this action is possible (see "possibleactions" in states.inc.php)
            if( ! this.checkAction( 'myAction' ) )
            {   return; }

            this.ajaxcall( "/shinobijingie/shinobijingie/myAction.html", { 
                                                                    lock: true, 
                                                                    myArgument1: arg1, 
                                                                    myArgument2: arg2,
                                                                    ...
                                                                 }, 
                         this, function( result ) {
                            
                            // What to do after the server call if it succeeded
                            // (most of the time: nothing)
                            
                         }, function( is_error) {

                            // What to do after the server call in anyway (success or failure)
                            // (most of the time: nothing)

                         } );        
        },        
        
        */

        
        ///////////////////////////////////////////////////
        //// Reaction to cometD notifications

        /*
            setupNotifications:
            
            In this method, you associate each of your game notifications with your local method to handle it.
            
            Note: game notification names correspond to "notifyAllPlayers" and "notifyPlayer" calls in
                  your shinobijingie.game.php file.
        
        */
        setupNotifications: function()
        {
            console.log( 'notifications subscriptions setup' );
            dojo.subscribe('cardDrew', this, "notif_cardDrew");
            dojo.subscribe('recruit', this, "notif_recruit");
            dojo.subscribe('beCorruptCard', this, 'notif_beCorruptCard');
            dojo.subscribe('beCorruptDraw', this, 'notif_beCorruptDraw');
            dojo.subscribe('placeClan', this, 'notif_placeClan');
            
            // TODO: here, associate your game notifications with local methods
            
            // Example 1: standard notification handling
            // dojo.subscribe( 'cardPlayed', this, "notif_cardPlayed" );
            
            // Example 2: standard notification handling + tell the user interface to wait
            //            during 3 seconds after calling the method in order to let the players
            //            see what is happening in the game.
            // dojo.subscribe( 'cardPlayed', this, "notif_cardPlayed" );
            // this.notifqueue.setSynchronous( 'cardPlayed', 3000 );
            // 
        },  

        notif_cardDrew: function(notif) {

        },
        
        notif_recruit: function(notif) {
            // remove current possible moves (makes the board more clear)
            var card = notif.args.new_card;
            var type = card.type;
            var value = card.type_arg;
            this.playerHand.addToStockWithId(this.getCardId(type, value), card.id)
        },

        notif_beCorruptCard: function(notif) {
            this.updateCorruptCardsNb(notif.args.corrupt);
        },

        notif_beCorruptDraw: function(notif) {
            for (let i in notif.args.new_cards) {
                var card = notif.args.new_cards[i];
                var type = card.type;
                var value = card.type_arg;
                console.log("card " + type + " " + value + " ; card.id " + card.id + " ; calculated id " + this.getCardId(type, value));
                this.playerHand.addToStockWithId(this.getCardId(type, value), card.id)
            }
        },

        notif_placeClan: function(notif) {
            console.log("Notif played" + JSON.stringify(notif.args.played_cards));

            var player = this.getActivePlayerId();

            // card.id = real id of the card (same as in db)
            // calculated id = place of card on sprite

            for (let i in notif.args.played_cards) {
                var card = notif.args.played_cards[i];
                var type = card.type;
                var value = card.type_arg;

                // add new cards in play area
                this.played_cards_players[player].addToStockWithId(this.getCardId(type, value), card.id);
            
                // remove card from hand
                this.playerHand.removeFromStockById(card.id);
            }

            
        },
   });             
});
