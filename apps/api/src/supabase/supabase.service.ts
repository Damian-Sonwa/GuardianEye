import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

@Injectable()
export class SupabaseService implements OnModuleInit {
  private readonly logger = new Logger(SupabaseService.name)
  private supabase: SupabaseClient
  private supabaseAdmin: SupabaseClient

  async onModuleInit() {
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      this.logger.error('❌ Supabase credentials not configured!')
      this.logger.error('   Please add SUPABASE_URL and SUPABASE_ANON_KEY to .env file')
      return
    }

    // Client for user operations (uses anon key)
    this.supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: false,
      },
    })

    // Admin client for server-side operations (uses service role key)
    if (supabaseServiceKey) {
      this.supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
      this.logger.log('✅ Supabase Admin client initialized')
    } else {
      this.logger.warn('⚠️  SUPABASE_SERVICE_ROLE_KEY not set - some admin operations may not work')
    }

    this.logger.log('✅ Supabase client initialized')
    this.logger.log(`📊 Supabase URL: ${supabaseUrl}`)
  }

  getClient(): SupabaseClient {
    return this.supabase
  }

  getAdminClient(): SupabaseClient {
    if (!this.supabaseAdmin) {
      throw new Error('Supabase Admin client not initialized. Set SUPABASE_SERVICE_ROLE_KEY in .env')
    }
    return this.supabaseAdmin
  }
}

