describe('Zealous Exorcist', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['zealous-exorcist', 'akodo-gunso']
                },
                player2: {
                    fate: 5,
                    inPlay: ['doji-whisperer'],
                    hand: ['messenger-of-misery', 'adept-of-shadows']
                }
            });
            this.exorcist = this.player1.findCardByName('zealous-exorcist');
            this.gunso = this.player1.findCardByName('akodo-gunso');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.messenger = this.player2.findCardByName('messenger-of-misery');
            this.adept = this.player2.findCardByName('adept-of-shadows');
        });

        it('should remove from the game a character that entered play during this conflict', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.exorcist, this.gunso],
                defenders: [this.whisperer]
            });
            this.player2.playCharacterFromHand(this.messenger);
            this.player2.clickPrompt('Conflict');
            expect(this.messenger.isParticipating()).toBe(true);
            this.player1.clickCard(this.exorcist);
            expect(this.player1).toHavePrompt('Zealous Exorcist');
            expect(this.player1).toBeAbleToSelect(this.messenger);
            expect(this.player1).not.toBeAbleToSelect(this.whisperer);
            expect(this.player1).not.toBeAbleToSelect(this.gunso);
            expect(this.player1).not.toBeAbleToSelect(this.exorcist);
            this.player1.clickCard(this.messenger);
            expect(this.messenger.location).toBe('removed from game');
        });

        it('should be able to choose a character that entered play at home during this conflict', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.exorcist, this.gunso],
                defenders: [this.whisperer]
            });
            this.player2.playCharacterFromHand(this.messenger);
            this.player2.clickPrompt('Home');
            expect(this.messenger.isParticipating()).toBe(false);
            this.player1.clickCard(this.exorcist);
            expect(this.player1).toBeAbleToSelect(this.messenger);
            this.player1.clickCard(this.messenger);
            expect(this.messenger.location).toBe('removed from game');
        });

        it('should not be able to choose a character that entered play before this conflict', function() {
            this.player1.pass();
            this.player2.playCharacterFromHand(this.adept);
            expect(this.adept.location).toBe('play area');
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.exorcist, this.gunso],
                defenders: [this.whisperer]
            });
            this.player2.pass();
            this.player1.clickCard(this.exorcist);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.adept.location).toBe('play area');
        });

        it('should not be usable while it is not participating', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.gunso],
                defenders: [this.whisperer]
            });
            this.player2.playCharacterFromHand(this.messenger);
            this.player2.clickPrompt('Conflict');
            this.player1.clickCard(this.exorcist);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.messenger.location).toBe('play area');
        });
    });
});
