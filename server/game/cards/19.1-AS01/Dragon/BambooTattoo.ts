import type { AbilityContext } from '../../../AbilityContext.js';
import AbilityDsl from '../../../abilitydsl.js';
import { CardTypes, EventNames, Locations, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import type { TriggeredAbilityContext } from '../../../TriggeredAbilityContext.js';

import type { EventPayload } from '../../../Events/EventPayloads.js';
export default class BambooTattoo extends DrawCard {
    static id = 'bamboo-tattoo';

    public setupCardAbilities() {
        this.attachmentConditions({ myControl: true, trait: 'monk' });

        this.whileAttached({ effect: AbilityDsl.effects.addTrait('tattooed') });

        this.persistentEffect({
            location: Locations.Any,
            targetController: Players.Any,
            effect: AbilityDsl.effects.reduceCost({
                amount: 1,
                targetCondition: (target: any) => target.type === CardTypes.Character && target.printedCost <= 3,
                match: (card: any, source: any) => card === source
            })
        });

        this.reaction({
            title: 'Ready attached character',
            when: {
                onCardBowed: (event: EventPayload<EventNames.OnCardBowed>, context: any) =>
                    context.source.parent &&
                    event.card === context.source.parent &&
                    event.context?.source.type !== 'ring' &&
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
            effectArgs: (context) => [this.isSelfTrigger(context) ? ' and dishonor' : '', context.source.parent]
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
