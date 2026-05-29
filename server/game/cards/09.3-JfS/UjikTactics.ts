import DrawCard from '../../DrawCard.js';
import { Durations } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class UjikTactics extends DrawCard {
    static id = 'ujik-tactics';

    setupCardAbilities() {
        this.action({
            title: 'Give each non-unique character +1 military during this conflict',
            condition: () => this.game.isDuringConflict(),
            gameAction: AbilityDsl.actions.cardLastingEffect(context => ({
                target: context.player.cardsInPlay.filter((card: any) => !card.isUnique()),
                effect: AbilityDsl.effects.modifyMilitarySkill(1),
                duration: Durations.UntilEndOfConflict
            })),
            effect: 'give all non-unique character they control +1{1}',
            effectArgs: ['military']
        });
    }
}


export default UjikTactics;
