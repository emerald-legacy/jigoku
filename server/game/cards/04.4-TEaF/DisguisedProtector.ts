import DrawCard from '../../drawcard.js';

class DisguisedProtector extends DrawCard {
    static id = 'disguised-protector';

    setupCardAbilities(ability) {
        this.action({
            title: 'Add each players honor bid to their skill total',
            condition: context => context.source.isParticipating(),
            effect: 'add the bid on each players dial to their skill total',
            gameAction: [
                ability.actions.playerLastingEffect(context => ({
                    targetController: context.player,
                    effect: ability.effects.changePlayerSkillModifier(context.player.showBid)
                })),
                ability.actions.playerLastingEffect(context => ({
                    condition: context => context.player.opponent,
                    targetController: context.player.opponent,
                    effect: ability.effects.changePlayerSkillModifier(context.player.opponent ? context.player.opponent.showBid : 0)
                }))
            ]
        });
    }
}


export default DisguisedProtector;
