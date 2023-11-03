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
            this.playerHand = new ebg.stock();
            this.playerHand.create(this, $('myhand'), this.cardwidth, this.cardheight);

            this.playerHand.image_items_per_row = 9;

            // create all cards types & add it as items of the stock "playerHand"
            var clans = {
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
                "y_The Monkey King": [1],
                "y_The Old Hermit": [3],
                "y_Mezumi": [3],
                "y_Oni": [8],
            };


            for (let clan in clans) {
                clans[clan].forEach(cardValue => {
                    var card_id = this.getCardId(clan, cardValue);
                    this.playerHand.addItemType(card_id, card_id, g_gamethemeurl + 'img/shinobi_cards.jpg', card_id);
                });
            }

            console.log("cards in hand")
            // Cards in player's hand
            for (let i in this.gamedatas.hand) {
                var card = this.gamedatas.hand[i];
                var type = card.type;
                var value = card.type_arg;

                console.log(card);
                this.playerHand.addToStockWithId(this.getCardId(type, value), card.id);
            }

            
 
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

        getCardId: function(card, value) {
            var clanValues = {
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

            var yokaiValues = {
                "y_Dragon" : 27,
                "y_Yurei" : 28,
                "y_Kitsune" : 29,
                "y_Kappa" : 30,
                "y_Saitenza" : 31,
                "y_The Monkey King" : 32,
                "y_The Old Hermit" : 33,
                "y_Mezumi" : 34,
                "y_Oni" : 35
            };

            if (card.split("_").length === 1) {
                return clanValues[card][value];
            } else {
                return yokaiValues[card];
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
