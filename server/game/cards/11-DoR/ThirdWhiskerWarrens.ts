import type { AbilityContext } from '../../AbilityContext.js';
import { Location, Players, CardType } from '../../Constants.js';
import { PlayCharacterAsIfFromHand } from '../../PlayCharacterAsIfFromHand.js';
import { PlayDisguisedCharacterAsIfFromHand } from '../../PlayDisguisedCharacterAsIfFromHand.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

export default class ThirdWhiskerWarrens extends DrawCard {
    static id = 'third-whisker-warrens';

    public setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => this.conflictAtKaiuWall(context),
            targetLocation: Location.DynastyDeck,
            match: (card, context) => context !== undefined && card === context.player.dynastyDeck[0],
            effect: [
                AbilityDsl.effects.hideWhenFaceUp(),
                AbilityDsl.effects.gainPlayAction(PlayCharacterAsIfFromHand),
                AbilityDsl.effects.gainPlayAction(PlayDisguisedCharacterAsIfFromHand)
            ]
        });

        this.persistentEffect({
            condition: (context) => this.conflictAtKaiuWall(context),
            targetController: Players.Self,
            effect: AbilityDsl.effects.showTopDynastyCard()
        });
    }

    private conflictAtKaiuWall(context: AbilityContext) {
        if(!context.player.isDefendingPlayer()) {
            return false;
        }

        if(context.game.currentConflict === null) {
            return false;
        }
        for(const province of context.game.currentConflict.getConflictProvinces()) {
            for(const card of context.player.getDynastyCardsInProvince(province.location)) {
                if(card.isFaceup() && card.type === CardType.Holding && card.hasTrait('kaiu-wall')) {
                    return true;
                }
            }
        }
        return false;
    }
}
