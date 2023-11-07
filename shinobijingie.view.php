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
 * shinobijingie.view.php
 *
 * This is your "view" file.
 *
 * The method "build_page" below is called each time the game interface is displayed to a player, ie:
 * _ when the game starts
 * _ when a player refreshes the game page (F5)
 *
 * "build_page" method allows you to dynamically modify the HTML generated for the game interface. In
 * particular, you can set here the values of variables elements defined in shinobijingie_shinobijingie.tpl (elements
 * like {MY_VARIABLE_ELEMENT}), and insert HTML block elements (also defined in your HTML template file)
 *
 * Note: if the HTML of your game interface is always the same, you don't have to place anything here.
 *
 */
  
require_once( APP_BASE_PATH."view/common/game.view.php" );
  
class view_shinobijingie_shinobijingie extends game_view
{
    protected function getGameName()
    {
        // Used for translations and stuff. Please do not modify.
        return "shinobijingie";
    }
    
  	function build_page( $viewArgs )
  	{		
  	    // Get players & players number
        $players = $this->game->loadPlayersBasicInfos();
        $players_nbr = count( $players );

        global $g_user;
        $current_player_id = $g_user->get_id();

        /*********** Place your code below:  ************/


        $template = self::getGameName() . "_" . self::getGameName();

        $this->page->begin_block($template, "player");
        foreach ($players as $player_id => $info) {
            if ($player_id != $current_player_id) {
                $this->page->insert_block("player", array(
                    "PLAYER_ID" => $player_id,
                    "PLAYER_NAME" => $players[$player_id]['player_name'],
                    "PLAYER_COLOR" => $players[$player_id]['player_color'],
                ));
            }
        }

        // this will make our My Hand text translatable
        $this->tpl['MY_HAND'] = self::_("My hand");



        /*********** Do not change anything below this line  ************/
  	}
}
