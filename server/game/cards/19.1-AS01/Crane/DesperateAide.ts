import DrawCard from '../../../DrawCard.js';

export default class DesperateAide extends DrawCard {
    static id = 'desperate-aide';

    public setupCardAbilities() {
        this.ability
            .composure()
            .appliesTo(($subject) => $subject.self())
            .modifiers(($modifier) => [
                $modifier.gainAbility(($ability) =>
                    $ability
                        .conflictAction()
                        .title('Draw a card')
                        .announce(($message, ctx, util) => {
                            const countsMore = util.politicalSkill(ctx.player) > util.politicalSkill(ctx.opponent);
                            return $message.withIntro`draw 1 card${countsMore ? ' and gain 1 honor' : ''}`;
                        })
                        .effects(($effect, ctx, util) => [
                            $effect.draw(ctx.player, 1),
                            $effect.if(
                                util.politicalSkill(ctx.player) > util.politicalSkill(ctx.opponent),
                                $effect.gainHonor(ctx.player, 1)
                            )
                        ])
                        .build()
                )
            ])
            .addPrinted();
    }
}
