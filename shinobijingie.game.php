<?php
 /**
  *------
  * BGA framework: © Gregory Isabelli <gisabelli@boardgamearena.com> & Emmanuel Colin <ecolin@boardgamearena.com>
  * shinobijingie implementation : © <Erin Bernardoni> <erin.bernardoni@outlook.fr>
  * 
  * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
  * See http://en.boardgamearena.com/#!doc/Studio for more information.
  * -----
  * 
  * shinobijingie.game.php
  *
  * This is the main file for your game logic.
  *
  * In this PHP file, you are going to defines the rules of the game.
  *
  */


require_once( APP_GAMEMODULE_PATH.'module/table/table.game.php' );


class shinobijingie extends Table
{
	function __construct( )
	{
        // Your global variables labels:
        //  Here, you can assign labels to global variables you are using for this game.
        //  You can use any number of global variables with IDs between 10 and 99.
        //  If your game has options (variants), you also have to associate here a label to
        //  the corresponding ID in gameoptions.inc.php.
        // Note: afterwards, you can get/set the global variables with getGameStateValue/setGameStateInitialValue/setGameStateValue
        parent::__construct();

        $this->cards = self::getNew("module.common.deck");
        $this->cards->init("card");
        
        self::initGameStateLabels( array( 
            //    "my_first_global_variable" => 10,
            //    "my_second_global_variable" => 11,
            //      ...
            //    "my_first_game_variant" => 100,
            //    "my_second_game_variant" => 101,
            //      ...
        ) );        
	}
	
    protected function getGameName( )
    {
		// Used for translations and stuff. Please do not modify.
        return "shinobijingie";
    }	

    /*
        setupNewGame:
        
        This method is called only once, when a new game is launched.
        In this method, you must setup the game according to the game rules, so that
        the game is ready to be played.
    */
    protected function setupNewGame( $players, $options = array() )
    {    
        // Set the colors of the players with HTML color code
        // The default below is red/green/blue/orange/brown
        // The number of colors defined here must correspond to the maximum number of players allowed for the gams
        $gameinfos = self::getGameinfos();
        $default_colors = array("777369", "D1A627", "7E1E17", "1D1914");
 
        // Create players
        // Note: if you added some extra field on "player" table in the database (dbmodel.sql), you can initialize it there.
        $sql = "INSERT INTO player (player_id, player_color, player_canal, player_name, player_avatar) VALUES ";
        $values = array();
        foreach( $players as $player_id => $player )
        {
            $color = array_shift( $default_colors );
            $values[] = "('".$player_id."','$color','".$player['player_canal']."','".addslashes( $player['player_name'] )."','".addslashes( $player['player_avatar'] )."')";
        }
        $sql .= implode( ',', $values );
        self::DbQuery( $sql );
        // self::reattributeColorsBasedOnPreferences( $players, $gameinfos['player_colors'] );
        self::reloadPlayersBasicInfos();
        
        /************ Start the game initialization *****/

        // Init global values with their initial values
        //self::setGameStateInitialValue( 'my_first_global_variable', 0 );
        
        // Init game statistics
        // (note: statistics used in this file must be defined in your stats.inc.php file)
        //self::initStat( 'table', 'table_teststat1', 0 );    // Init a table statistics
        //self::initStat( 'player', 'player_teststat1', 0 );  // Init a player statistics (for all players)

        // TODO: setup the initial game situation here

        // Create deck of card with all cards
        $cards = array();
        // Ronins
        for ($i=0; $i < 4 ; $i++) { 
            $cards[] = array('type' => "Ronin", 'type_arg' => 1, 'nbr' => 1);
        }

        // clans
        $clans = array(
            "Rat"       => array(3,3,3,4,4,4,5,5,5),
            "Fox"       => array(2,3,3,3,4,4,4,4,5),
            "Toad"      => array(1,1,3,3,3,4,4,4,4),
            "Spider"    => array(3,3,3,3,4,4,4,4,4),
            "Raven"     => array(2,2,2,3,3,3,4,4,4),
            "Carp"      => array(1,1,2,2,3,3,4,4,5),
            "Dragon"    => array(3,3,3,4,4,4,4,5,5),
            "Monkey"    => array(1,1,1,1,2,2,2,2,3),
            "Bear"      => array(6,6,6,6,6,6,6,6,6),
            "y_Dragon"          => array(5),
            "y_Yurei"           => array(1),
            "y_Kitsune"         => array(3),
            "y_Kappa"           => array(3),
            "y_Saitenza"        => array(3),
            "y_TheMonkeyKing" => array(1),
            "y_TheOldHermit"  => array(3),
            "y_Mezumi"          => array(3),
            "y_Oni"             => array(8)
        );

        foreach ($clans as $clan => $values) {
            foreach ($values as $key => $value) {
                $cards[] = array('type' => $clan, 'type_arg' => $value, 'nbr' => 1);
            }
        }

        $this->cards->createCards($cards, 'deck');

        // shuffle deck
        $this->cards->shuffle('deck');

        $this->cards->pickCardsForLocation(4, 'deck', 'discard', $no_deck_reform=true);
       

        // Activate first player (which is in general a good idea :) )
        $this->activeNextPlayer();

        $current_player_id = self::getActivePlayerId();

        // deal 8 cards to each players
        $players = self::loadPlayersBasicInfos();
        foreach ($players as $player_id => $value) {
            if ($player_id == $current_player_id) {
                $cards = $this->cards->pickCards(7,'deck',$player_id);
            } else {
                $cards = $this->cards->pickCards(8,'deck',$player_id);
            }
        }


        /************ End of the game initialization *****/
    }

    /*
        getAllDatas: 
        
        Gather all informations about current game situation (visible by the current player).
        
        The method is called each time the game interface is displayed to a player, ie:
        _ when the game starts
        _ when a player refreshes the game page (F5)
    */
    protected function getAllDatas()
    {
        $result = array();
    
        $current_player_id = self::getCurrentPlayerId();    // !! We must only return informations visible by this player !!
    
        // Get information about players
        // Note: you can retrieve some extra field you added for "player" table in "dbmodel.sql" if you need it.
        $sql = "SELECT player_id id, player_score score FROM player ";
        $result['players'] = self::getCollectionFromDb( $sql );
  
        // TODO: Gather all information about current game situation (visible by player $current_player_id).
        $result['hand'] = $this->cards->getCardsInLocation('hand', $current_player_id);

        // cards in jigoku
        $result['discard'] = $this->cards->getCardsInLocation('discard');

        $result['cards_nb'] = $this->cards->countCardsInLocations();

        $result['corrupt_cards'] = $this->cards->countCardsByLocationArgs('corrupt');

        return $result;
    }

    /*
        getGameProgression:
        
        Compute and return the current game progression.
        The number returned must be an integer beween 0 (=the game just started) and
        100 (= the game is finished or almost finished).
    
        This method is called each time we are in a game state with the "updateGameProgression" property set to true 
        (see states.inc.php)
    */
    function getGameProgression()
    {
        // TODO: compute and return the game progression

        return 0;
    }


//////////////////////////////////////////////////////////////////////////////
//////////// Utility functions
////////////    

    /*
        In this space, you can put any utility methods useful for your game logic
    */



//////////////////////////////////////////////////////////////////////////////
//////////// Player actions
//////////// 

    /*
        Each time a player is doing some game action, one of the methods below is called.
        (note: each method below must match an input method in shinobijingie.action.php)
    */

    function recruit() {
        self::checkAction('recruit');
        $this->gamestate->nextState("recruit");
    }

    function beCorrupt() {
        self::checkAction('beCorrupt');
        $this->gamestate->nextState("beCorrupt");
    }

    
//////////////////////////////////////////////////////////////////////////////
//////////// Game state arguments
////////////

    /*
        Here, you can create methods defined as "game state arguments" (see "args" property in states.inc.php).
        These methods function is to return some additional information that is specific to the current
        game state.
    */

    /*
    
    Example for game state "MyGameState":
    
    function argMyGameState()
    {
        // Get some values from the current game situation in database...
    
        // return values:
        return array(
            'variable1' => $value1,
            'variable2' => $value2,
            ...
        );
    }    
    */

//////////////////////////////////////////////////////////////////////////////
//////////// Game state actions
////////////

    /*
        Here, you can create methods defined as "game state actions" (see "action" property in states.inc.php).
        The action method of state X is called everytime the current game state is set to X.
    */

    function stRecruit()
    {
        
        $current_player_id = self::getActivePlayerId();
        $card = $this->cards->pickCard('deck',$current_player_id);


        // Notify all players but active player that one card was drew
        $players = self::loadPlayersBasicInfos();
        foreach ($players as $player_id => $player)
            if ($player_id != $current_player_id)
                self::notifyPlayer($player_id, 'cardDrew', clienttranslate('${player_name} draw a card'), array(
                    'player_id' => $current_player_id,
                    'player_name' => self::getActivePlayerName(),
                ));

        // Notify active player of their new card
        self::notifyPlayer($current_player_id, 'recruit', clienttranslate('You draw a '.$card['type'].' of value '.$card['type_arg']), array(
            'player_id' => $current_player_id,
            'player_name' => self::getActivePlayerName(),
            'new_card' => $card
        ));

        // go to another gamestate
        $this->gamestate->nextState( 'nextPlayer' );
    }
    
    function stBeCorrupt() {
        $current_player_id = self::getActivePlayerId();
        $card = $this->cards->pickCardForLocation('deck', 'corrupt', $current_player_id);


        // Notify all players of the card and send new values of corrupted field
        $corrupt = $this->cards->countCardsByLocationArgs('corrupt');
        self::notifyAllPlayers('beCorruptCard', clienttranslate('${player_name} draw'.$card['type'].' of value '.$card['type_arg']), array(
            'player_id' => $current_player_id,
            'player_name' => self::getActivePlayerName(),
            'new_card' => $card,
            'corrupt' => $corrupt
        ));

        // Draw cards according to the value of drew card + 2
        $cards = $this->cards->pickCards($card['type_arg'] + 2, 'deck', $current_player_id);

        // Notify all players but active player of the number of drew cards
        $players = self::loadPlayersBasicInfos();
        foreach ($players as $player_id => $player)
            if ($player_id != $current_player_id)
                self::notifyPlayer($player_id, 'cardDrew', clienttranslate('${player_name} draw'. count($cards) .'cards'), array(
                    'player_id' => $current_player_id,
                    'player_name' => self::getActivePlayerName(),
                ));

        // Notify player of their new card
        self::notifyPlayer($current_player_id, 'beCorruptDraw', clienttranslate('${player_name} draw '.count($cards).' cards'), array(
            'player_id' => $current_player_id,
            'player_name' => self::getActivePlayerName(),
            'new_cards' => $cards
        ));

        $this->gamestate->nextState( 'nextPlayer' );
    }

    function stNextPlayer() {
        $player_id = self::activeNextPlayer();
        self::giveExtraTime($player_id);

        $this->gamestate->nextState( 'nextTurn' );

    }
    
    /*
    
    Example for game state "MyGameState":

    function stMyGameState()
    {
        // Do some stuff ...
        
        // (very often) go to another gamestate
        $this->gamestate->nextState( 'some_gamestate_transition' );
    }    
    */

//////////////////////////////////////////////////////////////////////////////
//////////// Zombie
////////////

    /*
        zombieTurn:
        
        This method is called each time it is the turn of a player who has quit the game (= "zombie" player).
        You can do whatever you want in order to make sure the turn of this player ends appropriately
        (ex: pass).
        
        Important: your zombie code will be called when the player leaves the game. This action is triggered
        from the main site and propagated to the gameserver from a server, not from a browser.
        As a consequence, there is no current player associated to this action. In your zombieTurn function,
        you must _never_ use getCurrentPlayerId() or getCurrentPlayerName(), otherwise it will fail with a "Not logged" error message. 
    */

    function zombieTurn( $state, $active_player )
    {
    	$statename = $state['name'];
    	
        if ($state['type'] === "activeplayer") {
            switch ($statename) {
                default:
                    $this->gamestate->nextState( "zombiePass" );
                	break;
            }

            return;
        }

        if ($state['type'] === "multipleactiveplayer") {
            // Make sure player is in a non blocking status for role turn
            $this->gamestate->setPlayerNonMultiactive( $active_player, '' );
            
            return;
        }

        throw new feException( "Zombie mode not supported at this game state: ".$statename );
    }
    
///////////////////////////////////////////////////////////////////////////////////:
////////// DB upgrade
//////////

    /*
        upgradeTableDb:
        
        You don't have to care about this until your game has been published on BGA.
        Once your game is on BGA, this method is called everytime the system detects a game running with your old
        Database scheme.
        In this case, if you change your Database scheme, you just have to apply the needed changes in order to
        update the game database and allow the game to continue to run with your new version.
    
    */
    
    function upgradeTableDb( $from_version )
    {
        // $from_version is the current version of this game database, in numerical form.
        // For example, if the game was running with a release of your game named "140430-1345",
        // $from_version is equal to 1404301345
        
        // Example:
//        if( $from_version <= 1404301345 )
//        {
//            // ! important ! Use DBPREFIX_<table_name> for all tables
//
//            $sql = "ALTER TABLE DBPREFIX_xxxxxxx ....";
//            self::applyDbUpgradeToAllDB( $sql );
//        }
//        if( $from_version <= 1405061421 )
//        {
//            // ! important ! Use DBPREFIX_<table_name> for all tables
//
//            $sql = "CREATE TABLE DBPREFIX_xxxxxxx ....";
//            self::applyDbUpgradeToAllDB( $sql );
//        }
//        // Please add your future database scheme changes here
//
//


    }    
}
