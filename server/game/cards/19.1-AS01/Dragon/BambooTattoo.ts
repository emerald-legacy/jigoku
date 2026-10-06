import { addTrait, reduceCost } from '../../../effects.js';
import { conditional, dishonor, multiple, noAction, ready } from '../../../GameActions/GameActions.js';
import { Location, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import type { TriggeredAbilityContext } from '../../../TriggeredAbilityContext.js';

import Ring from '../../../Ring.js';
import { msg } from '../../../GameChat.js';
export default class BambooTattoo extends DrawCard {
    static id = 'bamboo-tattoo';

    public setupCardAbilities() {
        this.attachmentConditions({ myControl: true, trait: 'monk' });

        this.whileAttached({ effect: addTrait('tattooed') });

        this.persistentEffect({
            location: Location.Any,
            targetController: Players.Any,
            effect: reduceCost({
                amount: 1,
                targetCondition: (target) => target.isCharacter() && (target.printedCost ?? 0) <= 3,
                match: (card, source) => card === source
            })
        });

        this.reaction('Ready attached character')
            .when({
                onCardBowed: (event, context) =>
                    context.source.parentCharacter &&
                    event.card === context.source.parentCharacter &&
                    !(event.context?.source instanceof Ring) &&
                    event.context?.source.name !== 'Framework effect'
            })
            .gameAction(multiple([
                ready((context) => ({ target: context.source.parentCharacter ?? [] })),
                conditional({
                    condition: (context) => this.isSelfTrigger(context),
                    trueGameAction: dishonor((context) => ({ target: context.source.parentCharacter ?? [] })),
                    falseGameAction: noAction()
                })
            ]))
            .effect((context) => msg`ready${this.isSelfTrigger(context) ? ' and dishonor' : ''} ${context.source.parentCharacter}`);
    }

    private isSelfTrigger(context: TriggeredAbilityContext) {
        const triggerCtx = context.event.context;
        return !!(
            context.source.controller &&
            triggerCtx?.player &&
            context.source.controller === triggerCtx.player
        );
    }
}
