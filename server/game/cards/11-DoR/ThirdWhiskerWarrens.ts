import { Location, Players } from '../../Constants.js';
import { PlayFacedownCharacterAsIfFromHand } from '../../PlayCharacterAsIfFromHand.js';
import { PlayFacedownDisguisedCharacterAsIfFromHand } from '../../PlayDisguisedCharacterAsIfFromHand.js';
import { gainPlayAction, hideWhenFaceUp, showTopDynastyCard } from '../../effects.js';
import DrawCard from '../../DrawCard.js';
import { defendingAtKaiuWall } from '../kaiuWall.js';

export default class ThirdWhiskerWarrens extends DrawCard {
    static id = 'third-whisker-warrens';

    public setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => defendingAtKaiuWall(context.player, context.game.currentConflict),
            targetLocation: Location.DynastyDeck,
            match: (card, context) => context !== undefined && card === context.player.dynastyDeck[0],
            effect: [
                hideWhenFaceUp(),
                gainPlayAction(PlayFacedownCharacterAsIfFromHand),
                gainPlayAction(PlayFacedownDisguisedCharacterAsIfFromHand)
            ]
        });

        this.persistentEffect({
            condition: (context) => defendingAtKaiuWall(context.player, context.game.currentConflict),
            targetController: Players.Self,
            effect: showTopDynastyCard()
        });
    }
}
