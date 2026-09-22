import type { TriggeredAbilityContext } from '../../TriggeredAbilityContext.js';
import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType } from '../../Constants.js';

class EarthBecomesSky extends DrawCard {
    static id = 'earth-becomes-sky';

    setupCardAbilities() {
        this.reaction({
            title: 'Bow a character that just readied',
            when: {
                onCardReadied: (event, context) =>
                    event.card.type === CardType.Character && event.card.controller === context.player.opponent
            },
            gameAction: AbilityDsl.actions.bow((context: TriggeredAbilityContext<DrawCard, DrawCard>) => ({ target: context.event.card }))
        });
    }
}


export default EarthBecomesSky;
