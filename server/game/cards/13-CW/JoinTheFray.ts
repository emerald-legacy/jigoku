import DrawCard from '../../DrawCard.js';
import type Player from '../../Player.js';
import type { AbilityContext } from '../../AbilityContext.js';
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
            .effect('have {1} join the conflict for {2}!', context => [context.targets.character, this.getEffectArg(context, context.selects.select.choice)]);
    }

    getEffectArg(context: AbilityContext, selection: string): Player | undefined {
        if(selection === context.player.name) {
            return context.player;
        }
        return context.player.opponent;
    }
}


export default JoinTheFray;
