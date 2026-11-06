import DrawCard from '../../DrawCard.js';
import { Location, Players, CardType } from '../../Constants.js';
import { increaseLimitOnAbilities } from '../../effects.js';
import { cardLastingEffect, multiple } from '../../GameActions/GameActions.js';
import { getExtraUseDuration } from '../extraAbilityUse.js';
import { CardAbility } from '../../CardAbility.js';

class KaiuInventor extends DrawCard {
    static id = 'kaiu-inventor';

    override setupCardAbilities() {
        this.action('Add an additional ability use to a holding')
            .target({
                cardType: CardType.Holding,
                location: Location.Provinces,
                controller: Players.Self,
                cardCondition: (card) => card.isFaceup()
            }, multiple((context) => [...context.target?.getActions() ?? [], ...context.target?.getReactions() ?? []]
                .filter((ability): ability is CardAbility => ability instanceof CardAbility && ability.isTriggeredAbility())
                .map((ability) => cardLastingEffect({
                    target: context.target,
                    duration: getExtraUseDuration(ability),
                    targetLocation: Location.Provinces,
                    effect: increaseLimitOnAbilities({ targetAbility: ability })
                }))))
            .chatText('add an additional use to each of {0}\'s abilities');
    }
}


export default KaiuInventor;
