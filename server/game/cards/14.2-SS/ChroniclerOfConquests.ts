import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class ChroniclerOfConquests extends DrawCard {
    static id = 'chronicler-of-conquests';

    setupCardAbilities() {
        this.action({
            title: 'Gain 1 honor',
            condition: context => context.source.isParticipating() && context.game.isTraitInPlay('battlefield'),
            gameAction: AbilityDsl.actions.gainHonor(context => ({
                target: context.player
            }))
        });
    }
}


export default ChroniclerOfConquests;
