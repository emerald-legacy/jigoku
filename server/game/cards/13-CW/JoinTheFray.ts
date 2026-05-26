import DrawCard from '../../drawcard.js';
import { Locations, Players, CardTypes, TargetModes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class JoinTheFray extends DrawCard {
    static id = 'join-the-fray';

    setupCardAbilities() {
        this.action({
            title: 'Put a character into play from a province',
            condition: context => context.game.isDuringConflict('military'),
            targets: {
                character: {
                    cardType: CardTypes.Character,
                    location: Locations.Provinces,
                    controller: Players.Self,
                    cardCondition: card => card.hasTrait('cavalry')
                },
                select: {
                    dependsOn: 'character',
                    mode: TargetModes.Select,
                    targets: true,
                    activePromptTitle: 'Which side should this character be on?',
                    choices: {
                        [this.owner.name]: AbilityDsl.actions.putIntoConflict(context => ({ side: this.owner, target: context.targets.character })),
                        [this.owner.opponent && this.owner.opponent.name || 'NA']: AbilityDsl.actions.putIntoConflict(context => ({ side: this.owner.opponent, target: context.targets.character }))
                    }
                }
            },
            effect: 'have {1} join the conflict for {2}!',
            effectArgs: context => [context.targets.character, this.getEffectArg(context, context.selects.select.choice)]
        });
    }

    getEffectArg(context: any, selection: any) {
        if(selection === context.player.name) {
            return context.player;
        }
        return context.player.opponent;
    }
}


export default JoinTheFray;
