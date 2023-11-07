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
            
            // Setting up player boards
            for( var player_id in gamedatas.players )
            {
                var player = gamedatas.players[player_id];
                         
                // TODO: Setting up players boards if needed
            }
            
            // TODO: Set up your game interface here, according to "gamedatas"
            // create all cards types & add it as items of the stock "playerHand"

            dojo.addClass("player_corrupted", "ninja_" + this.gamedatas.players[ this.player_id ].color);

            // PLAYER HAND
            this.playerHand = new ebg.stock();
            this.createStock(this.playerHand, $('myhand'), this.gamedatas.hand);
            

            // DISCARD PILE
            this.discardPile = new ebg.stock();
            this.createStock(this.discardPile, $('discard'), this.gamedatas.discard);
            this.discardPile.container_div.width = "60px"; // enought just for 1 card
            this.discardPile.autowidth = false; // this is required so it obeys the width set above
            this.discardPile.use_vertical_overlap_as_offset = false; // this is to use normal vertical_overlap
            this.discardPile.vertical_overlap = 100; // overlap
            this.discardPile.horizontal_overlap  = -1; // current bug in stock - this is needed to enable z-index on overlapping items
            this.discardPile.item_margin = 0; // has to be 0 if using overlap
            this.discardPile.updateDisplay(); // re-layout


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




            // Modify number of cards in deck
            this.updateDeckCardsNb(this.gamedatas.cards_nb.deck);
            // Modify number of cards in discard
            this.updateDiscardCardsNb(this.gamedatas.cards_nb.discard);

            
 
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
            
            /* Example:
            
            case 'myGameState':
            
                // Show some HTML block at this game state
                dojo.style( 'my_html_block_id', 'display', 'block' );
                
                break;
           */
           
           
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
            
            /* Example:
            
            case 'myGameState':
            
                // Hide the HTML block we are displaying only during this game state
                dojo.style( 'my_html_block_id', 'display', 'none' );
                
                break;
           */
           
           
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

        updateDeckCardsNb: function (new_value) {
            var deck_cards = document.getElementById("deck-cards-nb");
            deck_cards.textContent = new_value;
        },

        updateDiscardCardsNb: function (new_value) {
            var discard_cards = document.getElementById("discard-cards-nb");
            discard_cards.textContent = new_value;
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

        ///////////////////////////////////////////////////
        //// Player's action
        
        /*
        
            Here, you are defining methods to handle player's action (ex: results of mouse click on 
            game objects).
            
            Most of the time, these methods:
            _ check the action is possible at this game state.
            _ make a call to the game server
        
        */
        
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
        
        // TODO: from this point and below, you can write your game notifications handling methods
        
        /*
        Example:
        
        notif_cardPlayed: function( notif )
        {
            console.log( 'notif_cardPlayed' );
            console.log( notif );
            
            // Note: notif.args contains the arguments specified during you "notifyAllPlayers" / "notifyPlayer" PHP call
            
            // TODO: play the card in the user interface.
        },    
        
        */
   });             
});
