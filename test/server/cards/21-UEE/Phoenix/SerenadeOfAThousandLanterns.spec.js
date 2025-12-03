describe("Serenade of a Thousand Lanterns", function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doomed-shugenja'],
                    hand: ['serenade-of-a-thousand-lanterns'],
                },
                player2: {
                    hand: ['assassination'],
                    inPlay: ['doji-challenger']
                }
            });

            this.doomed = this.player1.findCardByName('doomed-shugenja');
            this.serenade = this.player1.findCardByName('serenade-of-a-thousand-lanterns');
            this.assassination = this.player2.findCardByName('assassination');
            this.challenger = this.player2.findCardByName('doji-challenger');
        });

        it('sends home and gives honor', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.doomed],
                defenders: [this.challenger],
            });

            let honor = this.player1.honor;

            this.player2.pass();
            this.player1.clickCard(this.serenade);
            this.player1.clickCard(this.challenger);
            this.player1.clickPrompt('Done');
            expect(this.challenger.isParticipating()).toBe(false);
            expect(this.getChatLogs(5)).toContain(
                "player1 plays Serenade of a Thousand Lanterns to send Doji Challenger home"
            );
            expect(this.getChatLogs(5)).toContain(
                "player1 channels their fire affinity to gain 1 honor"
            );

            expect(this.player1.honor).toBe(honor + 1);
        });
    });
});
