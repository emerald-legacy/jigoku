import { CardType, Location, Players } from '../../../Constants.js';
import { ProvinceCard } from '../../../ProvinceCard.js';
import { modifyProvinceStrength } from '../../../effects.js';
import type Ring from '../../../Ring.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import { chooseAction, conditional, resolveRingEffect } from '../../../GameActions/GameActions.js';
import type { ChooseActionOption } from '../../../GameActions/ChooseGameAction.js';
import { msg } from '../../../GameChat.js';

export default class OnsenQuarters extends ProvinceCard {
    static id = 'onsen-quarters';

    public override setupCardAbilities() {
        this.persistentEffect({
            targetLocation: Location.Provinces,
            targetController: Players.Self,
            match: (card, context) =>
                !!context && card.type === CardType.Province && card !== context.source && card.controller === context.player,
            effect: modifyProvinceStrength(1)
        });

        this.reaction('Resolve the ring effect')
            .when({
                afterConflict: (event, context) =>
                    event.conflict.winner === context.player &&
                    event.conflict.getConflictProvinces().some((a) => a === context.source)
            })
            .gameAction(conditional((context) => {
                const rings = this.ringsForRole(context);
                const choices: Record<string, ChooseActionOption> = {};
                for(const ring of rings) {
                    choices[ring.name] = {
                        action: resolveRingEffect({ target: ring, player: context.player }),
                        message: (_context, _target, chooser) => msg`${chooser} chooses to resolve ${ring} effect`
                    };
                }
                return {
                    condition: rings.length > 1,
                    trueGameAction: chooseAction({ activePromptTitle: 'Choose a ring effect to resolve', choices }),
                    falseGameAction: resolveRingEffect({ target: rings[0], player: context.player })
                };
            }))
            .chatText((context) => {
                const rings = this.ringsForRole(context);
                return rings.length > 1 ? msg`resolve the ring effect of one of their role's elements` : msg`resolve ${rings[0]} effect`;
            });
    }

    private ringsForRole(context: AbilityContext): Ring[] {
        const rings: Ring[] = [];
        for(const trait of context.player.role?.traits ?? []) {
            const ring = context.game.ringFor(trait);
            if(ring && !rings.includes(ring)) {
                rings.push(ring);
            }
        }
        return rings;
    }
}
