import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { cardCannot, modifyMilitarySkill } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';
import { Players, CardType, RestrictionType, RestrictionScope } from '../../Constants.js';

class YogoAsami extends DrawCard {
    static id = 'yogo-asami';

    setupCardAbilities() {
        this.persistentEffect({
            match: (card) => card.name === 'Bayushi Kachiko',
            targetController: Players.Any,
            effect: cardCannot({
                cannot: RestrictionType.Target,
                appliesTo: RestrictionScope.AbilitiesTriggeredByOpponents
            })
        });
        this.action('Give a character -2/-0')
            .cost(costs.bowSelf())
            .condition((context) => context.source.isParticipating())
            .target({
                cardType: CardType.Character,
                controller: Players.Any,
                cardCondition: (card) => card.isParticipating()
            }, cardLastingEffect({ effect: modifyMilitarySkill(-2) }))
            .chatText('reduce {0}\'s military skill by 2');
    }
}


export default YogoAsami;
