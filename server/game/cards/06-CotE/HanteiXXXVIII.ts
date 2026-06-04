import type { AbilityContext } from '../../AbilityContext.js';
import type CardAbility from '../../CardAbility.js';
import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType, EventName } from '../../Constants.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class HanteiXXXVIII extends DrawCard {
    static id = 'hantei-xxxviii';

    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.delayedEffect({
                condition:  (context: AbilityContext) => context.player.opponent && !!context.player.opponent.imperialFavor,
                message: '{0} is discarded from play as its controller\'s opponent has the imperial favor',
                messageArgs: (context: AbilityContext) => [context.source],
                gameAction: AbilityDsl.actions.discardFromPlay()
            })
        });

        this.action({
            title: 'Bow a character',

            target: {
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating(),
                gameAction: AbilityDsl.actions.bow()
            }
        });

        this.interrupt({
            title: 'Choose targets for opponent\'s ability',
            when: {
                onCardAbilityInitiated: (event: EventPayload<EventName.OnCardAbilityInitiated>, context) =>
                    event.ability.hasTargetsChosenByInitiatingPlayer(event.context) && event.context.player === context.player.opponent
            },
            effect: 'choose targets for {1}\'s {2} ability',
            effectArgs: context => context ? [context.event.card ?? '', (context.event.ability as CardAbility)?.title ?? ''] : [],
            handler: context => {
                (context.event.context as AbilityContext).choosingPlayerOverride = context.player;
            }
        });
    }
}


export default HanteiXXXVIII;
