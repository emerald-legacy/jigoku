import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { AbilityTypes } from '../../Constants.js';

class Kikyo extends DrawCard {
    static id = 'kikyo';

    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true,
            unique: true,
            faction: 'crab'
        });

        this.grantedAbilityLimits = {};
        this.whileAttached({
            effect: AbilityDsl.effects.gainAbility(AbilityTypes.Reaction, {
                title: 'Make opponent discard a card at random',
                when: {
                    onCardsDrawn: (event, context) => {
                        return context.player.opponent && event.player === context.player && context.source.isParticipating();
                    }
                },
                printedAbility: false,
                gameAction: AbilityDsl.actions.discardAtRandom(context => ({
                    target: context.player.opponent,
                    amount: 1
                }))
            })
        });
    }
}


export default Kikyo;
