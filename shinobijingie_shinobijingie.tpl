{OVERALL_GAME_HEADER}

<!-- 
--------
-- BGA framework: © Gregory Isabelli <gisabelli@boardgamearena.com> & Emmanuel Colin <ecolin@boardgamearena.com>
-- shinobijingie implementation : © <Erin Bernardoni> <erin.bernardoni@outlook.fr>
-- 
-- This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
-- See http://en.boardgamearena.com/#!doc/Studio for more information.
-------
-->


<div id="board" class="board">
  <div id="table-center" class="whiteblock">
    <div class="stack-nb card-margin">
      <h3>Deck</h3>
      <div class="table-center-deck cards-stack-empty"></div>
      <h3 id="deck-cards-nb">3</h3>
    </div>
    <div class="stack-nb card-margin">
      <h3>Défausse</h3>
      <div class="table-center-deck cards-stack-empty discard-pile" id="discard"></div>
      <h3 id="discard-cards-nb">3</h3>
    </div>
  </div>

  <div id="table-hands">
    <div id="myhand_wrap" class="whiteblock">
      <h3>{MY_HAND}</h3>
      <div class="ninja-master" id="player_corrupted">
        <div class="ninja"></div>
        <div class="my_hand_ninja">3</div>
      </div>
      <div id="myhand"></div>
        <div class="line"></div>
      <div id="myplacedcards"></div>
    </div>

    <!-- BEGIN player -->
    <div class="playertable whiteblock">
        <div class="playertablename" style="color: #{PLAYER_COLOR}">
            {PLAYER_NAME}
        </div>
        <div class="ninja-master ninja_{PLAYER_COLOR}">
          <div class="ninja"></div>
          <div class="my_hand_ninja">3</div>
        </div>
        <div class="playertablecard" id="playertablecard_{PLAYER_ID}"></div>
        <div class="playerplacedcards" id="playerplacedcards_{PLAYER_ID}"></div>
    </div>
    <!-- END player -->
  </div>
</div>

<script type="text/javascript">

// Javascript HTML templates

var jstpl_discardDialog ='<div><div class="discard-pile" id="discard-dialog"></div><a href="#" id="dialog-ok-button" class="bgabutton bgabutton_blue"><span>OK</span></a></div>';

/*
// Example:
var jstpl_some_game_item='<div class="my_game_item" id="my_game_item_${MY_ITEM_ID}"></div>';

*/

</script>  

{OVERALL_GAME_FOOTER}
