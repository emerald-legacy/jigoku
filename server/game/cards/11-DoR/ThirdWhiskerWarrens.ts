import type { AbilityContext } from '../../AbilityContext.js';
import { Locations, Players, CardTypes } from '../../Constants.js';
import { PlayCharacterAsIfFromHand } from '../../PlayCharacterAsIfFromHand.js';
import { PlayDisguisedCharacterAsIfFromHand } from '../../PlayDisguisedCharacterAsIfFromHand.js';
import type { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';
import type BaseCard from '../../basecard.js';
import DrawCard from '../../drawcard.js';

export default class ThirdWhiskerWarrens extends DrawCard {
    static id = 'third-whisker-warrens';

    public setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => this.conflictAtKaiuWall(context),
            targetLocation: Locations.DynastyDeck,
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
        for(const province of context.game.currentConflict.getConflictProvinces() as ProvinceCard[]) {
            for(const card of context.player.getDynastyCardsInProvince(province.location) as BaseCard[]) {
                if(card.isFaceup() && card.type === CardTypes.Holding && card.hasTrait('kaiu-wall')) {
                    return true;
                }
            }
        }
        return false;
    }
}
