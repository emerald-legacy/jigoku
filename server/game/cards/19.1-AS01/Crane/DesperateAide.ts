import DrawCard from '../../../DrawCard.js';

export default class DesperateAide extends DrawCard {
    static id = 'desperate-aide';

    public setupCardAbilities() {
        this.ability
            .composure()
            .affects(($a) => $a.self())
            .effects(($mod) => [
                $mod.gainAbility(($ability) =>
                    $ability
                        .conflictAction()
                        .title('Draw a card')
                        .announce(($m, ctx, util) => {
                            const countsMore = util.politicalSkill(ctx.player) > util.politicalSkill(ctx.opponent);
                            return $m.withIntro`draw 1 card${countsMore ? ' and gain 1 honor' : ''}`;
                        })
                        .effects(($e, ctx, util) => [
                            $e.draw(ctx.player, 1),
                            $e.if(
                                util.politicalSkill(ctx.player) > util.politicalSkill(ctx.opponent),
                                $e.gainHonor(ctx.player, 1)
                            )
                        ])
                        .build()
                )
            ])
            .addPrinted();
    }
}
