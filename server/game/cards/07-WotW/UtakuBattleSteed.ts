import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../drawcard.js';

class UtakuBattleSteed extends DrawCard {
    static id = 'utaku-battle-steed';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.attachmentConditions({
            faction: 'unicorn'
        });

        this.whileAttached({
            effect: ability.effects.addTrait('cavalry')
        });

        this.reaction({
            title: 'Honor attached character',
            when: {
                afterConflict: (event: any, context: any) => context.source.parent && context.source.parent.isParticipating() &&
                                                   event.conflict.winner === context.source.parent.controller &&
                                                   event.conflict.conflictType === 'military'
            },
            gameAction: ability.actions.honor((context: any) => ({
                target: context.source.parent
            }))
        });
    }
}


export default UtakuBattleSteed;
