import { addTrait, reduceCost } from '../../../effects.js';
import { Location, Players, Trait } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import type { TriggeredAbilityContext } from '../../../TriggeredAbilityContext.js';

import { msg } from '../../../GameChat.js';
export default class BambooTattoo extends DrawCard {
    static id = 'bamboo-tattoo';

    public override setupCardAbilities() {
        this.attachmentConditions({ myControl: true, trait: Trait.Monk });

        this.whileAttached({ effect: addTrait(Trait.Tattooed) });

        this.persistentEffect({
            location: Location.Any,
            targetController: Players.Any,
            effect: reduceCost({
                amount: 1,
                targetCondition: (target) => target.isCharacter() && target.costAtMost(3),
                match: (card, source) => card === source
            })
        });

        this.reaction('Ready attached character')
            .when({
                onCardBowed: (event, context) =>
                    context.source.parentCharacter &&
                    event.card === context.source.parentCharacter &&
                    !!event.context?.ability.isCardAbility()
            })
            .ready((context) => ({ target: context.source.parentCharacter ?? [] }))
            .if((context) => this.isSelfTrigger(context))
            .dishonor((context) => ({ target: context.source.parentCharacter ?? [] }))
            .chatText((context) => msg`ready${this.isSelfTrigger(context) ? ' and dishonor' : ''} ${context.source.parentCharacter}`);
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
