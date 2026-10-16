import { Element, Players, RestrictionType, RestrictionScope, Trait } from '../../../Constants.js';
import { PlayCharacterAsAttachment } from '../../../PlayCharacterAsAttachment.js';
import type { EffectFactory } from '../../../Effects/EffectBuilder.js';
import { addTrait, immunity, playerCannot } from '../../../effects.js';
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
            this.restrictParentController(targetController, playerCannot({ cannot: RestrictionType.MoveToHand }));
            this.restrictParentController(targetController, playerCannot({ cannot: RestrictionType.ReturnToHand }));
        }
    }

    public override getPrintedElementSymbols() {
        return [...super.getPrintedElementSymbols(), ...claimedRingSymbols([elementSymbol])];
    }

    private restrictParentController(targetController: Players.Self | Players.Opponent, effect: EffectFactory) {
        this.persistentEffect({
            condition: (context) => {
                const parent = context.source.parentCharacter;
                return !!parent && parent.isParticipating() &&
                    (parent.controller === context.player) === (targetController === Players.Self) &&
                    !hasClaimedRing(this, elementSymbol.key, parent.controller);
            },
            targetController,
            effect: effect
        });
    }
}
