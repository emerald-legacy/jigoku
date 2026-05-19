import DrawCard from '../../drawcard.js';

class InfiltratorsTools extends DrawCard {
    static id = 'infiltrator-s-tools';

    setupCardAbilities(ability) {
        this.attachmentConditions({
            trait: 'shinobi'
        });

        this.whileAttached({
            effect: ability.effects.addKeyword('covert')
        });
    }
}


export default InfiltratorsTools;
