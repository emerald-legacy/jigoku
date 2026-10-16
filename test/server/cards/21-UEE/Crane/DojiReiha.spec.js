describe('Doji Reiha', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-reiha', 'doji-whisperer']
                },
                player2: {
                    inPlay: ['togashi-mitsu', 'agasha-swordsmith']
                }
            });
            this.reiha = this.player1.findCardByName('doji-reiha');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.mitsu = this.player2.findCardByName('togashi-mitsu');
            this.swordsmith = this.player2.findCardByName('agasha-swordsmith');
        });

        const resolveDuel = function (spec, bid = '1') {
            spec.player1.clickCard(spec.reiha);
            spec.player2.clickCard(spec.mitsu);
            spec.player1.clickPrompt(bid);
            spec.player2.clickPrompt('1');
        };

        it('lets the controller of the winner move each contestant home', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.reiha],
                defenders: [this.mitsu],
                type: 'political'
            });
            this.player2.pass();
            resolveDuel(this, '2');

            this.player1.clickPrompt('Move all duel participants home');
            expect(this.reiha.isParticipating()).toBe(false);
            expect(this.mitsu.isParticipating()).toBe(false);
        });

        it('honors each contestant once and lets nobody choose on a tie', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.reiha],
                defenders: [this.mitsu],
                type: 'political'
            });
            this.player2.pass();
            resolveDuel(this);

            expect(this.reiha.isHonored).toBe(true);
            expect(this.mitsu.isHonored).toBe(true);
            expect(this.player1).not.toHavePromptButton('Move all duel participants home');
            expect(this.player2).not.toHavePromptButton('Move all duel participants home');
            expect(this.reiha.isParticipating()).toBe(true);
            expect(this.mitsu.isParticipating()).toBe(true);
        });

        it('only removes the dishonored status from a dishonored contestant', function () {
            this.reiha.dishonor();
            expect(this.reiha.isDishonored).toBe(true);

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.reiha],
                defenders: [this.mitsu],
                type: 'political'
            });
            this.player2.pass();
            resolveDuel(this);
            this.player2.clickPrompt('Do nothing');

            // One honor on a dishonored character clears the status; it must not honor twice.
            expect(this.reiha.isDishonored).toBe(false);
            expect(this.reiha.isHonored).toBe(false);
            expect(this.mitsu.isHonored).toBe(true);
        });
    });
});
