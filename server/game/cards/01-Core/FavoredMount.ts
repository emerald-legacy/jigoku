import DrawCard from '../../drawcard';

class FavoredMount extends DrawCard {
    static id = 'favored-mount';

    setupCardAbilities(ability) {
        this.attachmentConditions({
            myControl: true
        });

        this.whileAttached({
            effect: ability.effects.addTrait('cavalry')
        });

        this.action({
            title: 'Move this character into the conflict',
            cost: ability.costs.bowSelf(),
            gameAction: ability.actions.moveToConflict(context => ({ target: context.source.parent }))
        });
    }
}


export default FavoredMount;
