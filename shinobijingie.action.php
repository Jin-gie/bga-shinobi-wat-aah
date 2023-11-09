<?php
/**
 *------
 * BGA framework: © Gregory Isabelli <gisabelli@boardgamearena.com> & Emmanuel Colin <ecolin@boardgamearena.com>
 * shinobijingie implementation : © <Erin Bernardoni> <erin.bernardoni@outlook.fr>
 *
 * This code has been produced on the BGA studio platform for use on https://boardgamearena.com.
 * See http://en.doc.boardgamearena.com/Studio for more information.
 * -----
 * 
 * shinobijingie.action.php
 *
 * shinobijingie main action entry point
 *
 *
 * In this file, you are describing all the methods that can be called from your
 * user interface logic (javascript).
 *       
 * If you define a method "myAction" here, then you can call it from your javascript code with:
 * this.ajaxcall( "/shinobijingie/shinobijingie/myAction.html", ...)
 *
 */
  
  
  class action_shinobijingie extends APP_GameAction
  { 
    // Constructor: please do not modify
   	public function __default()
  	{
  	    if( self::isArg( 'notifwindow') )
  	    {
            $this->view = "common_notifwindow";
  	        $this->viewArgs['table'] = self::getArg( "table", AT_posint, true );
  	    }
  	    else
  	    {
            $this->view = "shinobijingie_shinobijingie";
            self::trace( "Complete reinitialization of board game" );
      }
  	} 
  	
  	// TODO: defines your action entry points there

    public function recruit() {
      self::setAjaxMode();     

      // Then, call the appropriate method in your game logic, like "playCard" or "myAction"
      $this->game->recruit();

      self::ajaxResponse( );

    }

    public function beCorrupt() {
      self::setAjaxMode();     

      // Then, call the appropriate method in your game logic, like "playCard" or "myAction"
      $this->game->beCorrupt();

      self::ajaxResponse( );

    }

    public function placeClan() {
      self::setAjaxMode();     

      // Then, call the appropriate method in your game logic, like "playCard" or "myAction"
      $this->game->placeClan();

      self::ajaxResponse( );
    }

    public function reinforceClan() {
      self::setAjaxMode();     

      // Then, call the appropriate method in your game logic, like "playCard" or "myAction"
      $this->game->reinforceClan();

      self::ajaxResponse( );
    }

    public function pass() {
      self::setAjaxMode();     

      // Then, call the appropriate method in your game logic, like "playCard" or "myAction"
      $this->game->pass();

      self::ajaxResponse( );
    }


    /*
    
    Example:
  	
    public function myAction()
    {
        self::setAjaxMode();     

        // Retrieve arguments
        // Note: these arguments correspond to what has been sent through the javascript "ajaxcall" method
        $arg1 = self::getArg( "myArgument1", AT_posint, true );
        $arg2 = self::getArg( "myArgument2", AT_posint, true );

        // Then, call the appropriate method in your game logic, like "playCard" or "myAction"
        $this->game->myAction( $arg1, $arg2 );

        self::ajaxResponse( );
    }
    
    */

  }
  

