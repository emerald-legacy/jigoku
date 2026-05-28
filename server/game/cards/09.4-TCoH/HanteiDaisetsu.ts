import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardTypes, Durations } from '../../Constants.js';

class HanteiDaisetsu extends DrawCard {
    static id = 'hantei-daisetsu';

    setupCardAbilities() {
        this.action({
            title: 'Blank a participating character',
            condition: (context) => context.source.isParticipating() && context.game.isDuringConflict('political'),
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card) => card.isParticipating(),
                gameAction: AbilityDsl.actions.cardLastingEffect({
                    effect: AbilityDsl.effects.blank(),
                    duration: Durations.UntilEndOfConflict
                })
            },
            effect: 'treat {1} as if its text box were blank until the end of the conflict',
            effectArgs: (context) => [(context.target as DrawCard)]
        });
    }
}


export default HanteiDaisetsu;
