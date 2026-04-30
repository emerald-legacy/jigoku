import DrawCard from '../../drawcard';
import { Players, CardTypes } from '../../Constants';
import AbilityDsl from '../../abilitydsl';

class RecklessAvenger extends DrawCard {
    static id = 'reckless-avenger';

    setupCardAbilities() {
        this.action({
            title: 'Ready and honor characters',
            condition: context => context.player.cardsInPlay.some(a => a.bowed) && context.player.opponent || context.player.opponent.cardsInPlay.some(a => a.bowed),
            targets: {
                firstCharacter: {
                    activePromptTitle: 'Choose a character',
                    cardType: CardTypes.Character,
                    optional: true,
                    hideIfNoLegalTargets: true,
                    controller: context => context.player.firstPlayer ? Players.Self : Players.Opponent,
                    player: context => context.player.firstPlayer ? Players.Self : Players.Opponent,
                    gameAction: AbilityDsl.actions.ready()
                },
                secondCharacter: {
                    activePromptTitle: 'Choose a character',
                    cardType: CardTypes.Character,
                    optional: true,
                    dependsOn: 'firstCharacter',
                    controller: context => context.player.firstPlayer ? Players.Opponent : Players.Self,
                    player: context => context.player.firstPlayer ? Players.Opponent : Players.Self,
                    gameAction: AbilityDsl.actions.conditional({
                        condition: context => this.isTargetValid(context.targets.firstCharacter),
                        trueGameAction: AbilityDsl.actions.honor(context => ({
                            target: context.targets.secondCharacter
                        })),
                        falseGameAction: AbilityDsl.actions.ready(context => ({
                            target: context.targets.secondCharacter
                        }))
                    })
                }
            },
            effect: 'ready {1}{2}{3}',
            effectArgs: context => [
                this.isTargetValid(context.targets.firstCharacter) ? context.targets.firstCharacter : context.targets.secondCharacter,
                this.isTargetValid(context.targets.firstCharacter) ? ' and honor ' : '',
                this.isTargetValid(context.targets.firstCharacter) ? context.targets.secondCharacter : ''
            ]
        });
    }

    isTargetValid(target) {
        return !!target && !Array.isArray(target);
    }
}


export default RecklessAvenger;


