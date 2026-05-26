import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../drawcard.js';

export default class KakitaBlade extends DrawCard {
    static id = 'kakita-blade';

    setupCardAbilities() {
        this.whileAttached({
            condition: () => !!this.parent && (this.game.currentDuel?.isInvolvedInAnyDuel(this.parent) ?? false),
            effect: AbilityDsl.effects.modifyPoliticalSkill(2)
        });

        this.reaction({
            title: 'Gain honor on duel win',
            when: {
                afterDuel: (event: any, context) => event.winner?.includes(context.source.parent) ?? false
            },
            gameAction: AbilityDsl.actions.gainHonor()
        });
    }
}
