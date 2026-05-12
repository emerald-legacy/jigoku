import DrawCard from '../../drawcard';

class ShinjoOutrider extends DrawCard {
    static id = 'shinjo-outrider';

    setupCardAbilities(ability) {
        this.action({
            title: 'Move this character to conflict',
            gameAction: ability.actions.moveToConflict()
        });
    }
}


export default ShinjoOutrider;
