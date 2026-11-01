import { Location, Players } from '../../Constants.js';
import { PlayCharacterAsIfFromHand } from '../../PlayCharacterAsIfFromHand.js';
import { PlayDisguisedCharacterAsIfFromHand } from '../../PlayDisguisedCharacterAsIfFromHand.js';
import { gainPlayAction, hideWhenFaceUp, showTopDynastyCard } from '../../effects.js';
import DrawCard from '../../DrawCard.js';
import { defendingAtKaiuWall } from '../kaiuWall.js';

export default class ThirdWhiskerWarrens extends DrawCard {
    static id = 'third-whisker-warrens';

    public override setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => defendingAtKaiuWall(context.player, context.game.currentConflict),
            targetLocation: Location.DynastyDeck,
            match: (card, context) => context !== undefined && card === context.player.dynastyDeck[0],
            effect: [
                hideWhenFaceUp(),
                gainPlayAction((card) => new PlayCharacterAsIfFromHand(card, { facedown: true })),
                gainPlayAction((card) => new PlayDisguisedCharacterAsIfFromHand(card, { facedown: true }))
            ]
        });

        this.persistentEffect({
            condition: (context) => defendingAtKaiuWall(context.player, context.game.currentConflict),
            targetController: Players.Self,
            effect: showTopDynastyCard()
        });
    }
}
