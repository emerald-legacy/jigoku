import DrawCard from '../../DrawCard.js';
import { Location, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class OneOfTheForgotten extends DrawCard {
    static id = 'one-of-the-forgotten';

    setupCardAbilities() {
        this.persistentEffect({
            location: Location.Any,
            effect: AbilityDsl.effects.playerCannot({
                cannot: 'placeFateWhenPlayingCharacterFromProvince',
                restricts: 'source'
            })
        });

        this.reaction({
            title: 'Gain fate',
            when: {
                onConflictPass: (event, context) => context.player.opponent && event.conflict.attackingPlayer === context.player.opponent && context.player.opponent.cardsInPlay.some(card => card.type === CardType.Character && !card.bowed)
            },
            gameAction: AbilityDsl.actions.placeFate()
        });
    }
}


export default OneOfTheForgotten;
