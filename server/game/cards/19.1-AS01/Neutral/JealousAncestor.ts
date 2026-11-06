import { Element, Location, Players, RestrictionType, RestrictionScope, Trait } from '../../../Constants.js';
import { PlayCharacterAsAttachment } from '../../../PlayCharacterAsAttachment.js';
import type { EffectFactory } from '../../../Effects/EffectBuilder.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import { addTrait, cardCannot, immunity, playerCannot } from '../../../effects.js';
import DrawCard from '../../../DrawCard.js';
import { claimedRingSymbols, hasClaimedRing } from '../../claimedRings.js';

const elementSymbol = { key: 'jealous-ancestor-void', element: Element.Void };

export default class JealousAncestor extends DrawCard {
    static id = 'jealous-ancestor';

    public override setupCardAbilities() {
        this.abilities.playActions.push(new PlayCharacterAsAttachment(this));

        this.whileAttached({ effect: addTrait(Trait.Shadowlands) });
        this.persistentEffect({
            condition: (context) => !!context.source.parentCharacter,
            effect: immunity({ appliesTo: RestrictionScope.Events })
        });

        for(const targetController of [Players.Self, Players.Opponent] as const) {
            const theirCardEffects = targetController === Players.Self ? RestrictionScope.OwnCardEffects : RestrictionScope.OpponentsCardEffects;
            this.restrictParentController(targetController, playerCannot({ cannot: RestrictionType.Draw, appliesTo: theirCardEffects }));
            // "add cards to their hand": the cards they own, which go to their hand
            this.persistentEffect({
                condition: (context) => this.restrictsParentController(context, targetController),
                targetLocation: Location.Any,
                targetController: Players.Any,
                match: (card, context) => card.owner === context?.source.parentCharacter?.controller,
                effect: [
                    cardCannot({ cannot: RestrictionType.MoveToHand, appliesTo: theirCardEffects }),
                    cardCannot({ cannot: RestrictionType.ReturnToHand, appliesTo: theirCardEffects })
                ]
            });
        }
    }

    protected override printedElementSymbols = claimedRingSymbols([elementSymbol]);

    private restrictParentController(targetController: Players.Self | Players.Opponent, effect: EffectFactory) {
        this.persistentEffect({
            condition: (context) => this.restrictsParentController(context, targetController),
            targetController,
            effect: effect
        });
    }

    private restrictsParentController(context: AbilityContext<this>, targetController: Players.Self | Players.Opponent) {
        const parent = context.source.parentCharacter;
        return !!parent && parent.isParticipating() &&
            (parent.controller === context.player) === (targetController === Players.Self) &&
            !hasClaimedRing(this, elementSymbol.key, parent.controller);
    }
}
