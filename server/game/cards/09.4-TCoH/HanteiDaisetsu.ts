import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType, Duration } from '../../Constants.js';

class HanteiDaisetsu extends DrawCard {
    static id = 'hantei-daisetsu';

    setupCardAbilities() {
        this.action<DrawCard>({
            title: 'Blank a participating character',
            condition: (context) => context.source.isParticipating() && context.game.isDuringConflict('political'),
            target: {
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating(),
                gameAction: AbilityDsl.actions.cardLastingEffect({
                    effect: AbilityDsl.effects.blank(),
                    duration: Duration.UntilEndOfConflict
                })
            },
            effect: 'treat {1} as if its text box were blank until the end of the conflict',
            effectArgs: (context) => [context.target ?? '']
        });
    }
}


export default HanteiDaisetsu;
