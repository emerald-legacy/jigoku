import DrawCard from '../../drawcard.js';

class UtakuBattleSteed extends DrawCard {
    static id = 'utaku-battle-steed';

    setupCardAbilities(ability) {
        this.attachmentConditions({
            faction: 'unicorn'
        });

        this.whileAttached({
            effect: ability.effects.addTrait('cavalry')
        });

        this.reaction({
            title: 'Honor attached character',
            when: {
                afterConflict: (event, context) => context.source.parent && context.source.parent.isParticipating() &&
                                                   event.conflict.winner === context.source.parent.controller &&
                                                   event.conflict.conflictType === 'military'
            },
            gameAction: ability.actions.honor(context => ({
                target: context.source.parent
            }))
        });
    }
}


export default UtakuBattleSteed;
