import DrawCard from '../../DrawCard.js';
import { Location, Players, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class JoinTheFray extends DrawCard {
    static id = 'join-the-fray';

    setupCardAbilities() {
        this.action('Put a character into play from a province')
            .condition(context => context.game.isDuringConflict('military'))
            .target('character', {
                cardType: CardType.Character,
                location: Location.Provinces,
                controller: Players.Self,
                cardCondition: card => card.hasTrait('cavalry')
            })
            .select('select', {
                dependsOn: 'character',
                targets: true,
                activePromptTitle: 'Which side should this character be on?'
            }, {
                [this.owner.name]: AbilityDsl.actions.putIntoConflict(context => ({ side: this.owner, target: context.targets.character })),
                [this.owner.opponent && this.owner.opponent.name || 'NA']: AbilityDsl.actions.putIntoConflict(context => ({ side: this.owner.opponent, target: context.targets.character }))
            })
            .effect('have {1} join the conflict for {2}!', (context) => [
                context.targets.character,
                context.selects.select.choice === context.player.name ? context.player : context.player.opponent
            ]);
    }
}


export default JoinTheFray;
