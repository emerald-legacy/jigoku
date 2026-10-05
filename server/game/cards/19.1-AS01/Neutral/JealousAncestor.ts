import { Element, Players } from '../../../Constants.js';
import { PlayCharacterAsAttachment } from '../../../PlayCharacterAsAttachment.js';
import type { EffectFactory } from '../../../Effects/EffectBuilder.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';
import { claimedRingSymbols, hasClaimedRing } from '../../claimedRings.js';

const elementSymbol = { key: 'jealous-ancestor-void', element: Element.Void };

export default class JealousAncestor extends DrawCard {
    static id = 'jealous-ancestor';

    public setupCardAbilities() {
        this.abilities.playActions.push(new PlayCharacterAsAttachment(this));

        this.whileAttached({ effect: AbilityDsl.effects.addTrait('shadowlands') });
        this.persistentEffect({
            condition: (context) => !!context.source.parentCharacter,
            effect: AbilityDsl.effects.immunity({ restricts: 'events' })
        });

        this.addAttachedEffectOnOpponent(
            AbilityDsl.effects.playerCannot({ cannot: 'draw', restricts: 'opponentsCardEffects' })
        );
        this.addAttachedEffectOnOpponent(AbilityDsl.effects.playerCannot({ cannot: 'move', restricts: 'toHand' }));
        this.addAttachedEffectOnOpponent(AbilityDsl.effects.playerCannot({ cannot: 'returnToHand' }));
    }

    public getPrintedElementSymbols() {
        return [...super.getPrintedElementSymbols(), ...claimedRingSymbols([elementSymbol])];
    }

    private addAttachedEffectOnOpponent(effect: EffectFactory) {
        this.persistentEffect({
            condition: (context) => {
                const parent = context.source.parentCharacter;
                return !!parent && parent.isParticipating() && !hasClaimedRing(this, elementSymbol.key, parent.controller);
            },
            targetController: Players.Opponent,
            effect: effect
        });
    }
}
