import type { AbilityContext } from '../../../AbilityContext.js';
import type BaseCard from '../../../BaseCard.js';
import AbilityDsl from '../../../abilitydsl.js';
import { CardType, EventName, Location, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import type { TriggeredAbilityContext } from '../../../TriggeredAbilityContext.js';

import type { EventPayload } from '../../../Events/EventPayloads.js';
export default class BambooTattoo extends DrawCard {
    static id = 'bamboo-tattoo';

    public setupCardAbilities() {
        this.attachmentConditions({ myControl: true, trait: 'monk' });

        this.whileAttached({ effect: AbilityDsl.effects.addTrait('tattooed') });

        this.persistentEffect({
            location: Location.Any,
            targetController: Players.Any,
            effect: AbilityDsl.effects.reduceCost({
                amount: 1,
                targetCondition: (target: BaseCard) => target.type === CardType.Character && ((target as DrawCard).printedCost ?? 0) <= 3,
                match: (card, source) => card === source
            })
        });

        this.reaction({
            title: 'Ready attached character',
            when: {
                onCardBowed: (event: EventPayload<EventName.OnCardBowed>, context) =>
                    context.source.parent &&
                    event.card === context.source.parent &&
                    (event.context?.source.type as string) !== 'ring' &&
                    event.context?.source.name !== 'Framework effect'
            },
            gameAction: AbilityDsl.actions.multiple([
                AbilityDsl.actions.ready((context) => ({ target: context.source.parent })),
                AbilityDsl.actions.conditional({
                    condition: (context: TriggeredAbilityContext<this>) => this.isSelfTrigger(context),
                    trueGameAction: AbilityDsl.actions.dishonor((context) => ({ target: context.source.parent })),
                    falseGameAction: AbilityDsl.actions.noAction()
                })
            ]),
            effect: 'ready{1} {2}',
            effectArgs: (context) => [this.isSelfTrigger(context) ? ' and dishonor' : '', context.source.parent as DrawCard]
        });
    }

    private isSelfTrigger(context: TriggeredAbilityContext<this>) {
        const triggerCtx = context.event.context as AbilityContext;
        return (
            context.source.controller &&
            triggerCtx.player &&
            context.source.controller === triggerCtx.player
        );
    }
}
