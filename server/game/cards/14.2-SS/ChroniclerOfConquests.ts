import DrawCard from '../../DrawCard.js';

class ChroniclerOfConquests extends DrawCard {
    static id = 'chronicler-of-conquests';

    setupCardAbilities() {
        this.action('Gain 1 honor')
            .condition((context) => context.source.isParticipating() && context.game.isTraitInPlay('battlefield'))
            .gainHonor();
    }
}


export default ChroniclerOfConquests;
